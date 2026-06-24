import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, needsPasswordRehash, verifyPassword } from "@/lib/password";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { getOptionalSecret, getRequiredSecret } from "@/lib/env";
import { canUseDemoData } from "@/lib/admin-dev-fallbacks";

const DEV_ADMIN_EMAIL = "admin@avoryne.com";
const DEV_ADMIN_PASSWORD = "admin123456";

async function createToken(payload: string): Promise<string> {
  const secret = getRequiredSecret("ADMIN_SECRET");
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
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

function canUseDevAdmin() {
  return canUseDemoData();
}

async function createAdminResponse(user: { id: string; email: string }) {
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

export async function POST(request: NextRequest) {
  const adminSecret = getOptionalSecret("ADMIN_SECRET");
  const authSecret = getOptionalSecret("AUTH_SECRET");
  if (!adminSecret || !authSecret) {
    return NextResponse.json({ error: "Server authentication is not configured" }, { status: 500 });
  }

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

  let user;
  try {
    user = await prisma.user.findUnique({ where: { email } });
  } catch {
    if (canUseDevAdmin() && email === DEV_ADMIN_EMAIL && password === DEV_ADMIN_PASSWORD) {
      return createAdminResponse({ id: "local-dev-admin", email: DEV_ADMIN_EMAIL });
    }

    return NextResponse.json(
      { error: "本地数据库未连接。开发预览可使用 admin@avoryne.com / admin123456" },
      { status: 503 }
    );
  }

  if (
    !user ||
    !verifyPassword(password, user.password, {
      legacySecret: authSecret,
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

  return createAdminResponse({ id: user.id, email: user.email });
}
