import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, needsPasswordRehash, verifyPassword } from "@/lib/password";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { getOptionalSecret } from "@/lib/env";
import { createAdminToken } from "@/lib/admin-token";

async function createAdminResponse(user: { id: string; email: string }) {
  const token = await createAdminToken(user);

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
    return NextResponse.json(
      { error: "本地数据库未连接，无法验证管理员账号" },
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
