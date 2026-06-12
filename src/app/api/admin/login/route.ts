import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, needsPasswordRehash, verifyPassword } from "@/lib/password";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const SECRET = process.env.ADMIN_SECRET || "agatelier-admin-secret-change-me";

async function createToken(payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const sigHex = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${payload}:${sigHex}`;
}

export async function POST(request: NextRequest) {
  const limit = rateLimit(`admin-login:${getClientIp(request)}`, {
    limit: 10,
    windowMs: 15 * 60 * 1000,
  });
  if (!limit.success) {
    return NextResponse.json(
      { error: "登录尝试过多，请稍后再试" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const { email, password } = await request.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (
    !user ||
    !verifyPassword(password, user.password, {
      legacySecret: process.env.AUTH_SECRET || "agatelier-auth-secret-change-me",
      allowPlainTextLegacy: true,
    }) ||
    user.role !== "admin"
  ) {
    return NextResponse.json({ error: "邮箱或密码错误，或不是管理员" }, { status: 401 });
  }

  if (needsPasswordRehash(user.password)) {
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashPassword(password) },
    });
  }

  const token = await createToken(
    JSON.stringify({ userId: user.id, email: user.email })
  );

  const response = NextResponse.json({ success: true });
  response.cookies.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return response;
}
