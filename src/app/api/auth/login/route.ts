import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, needsPasswordRehash, verifyPassword } from "@/lib/password";
import { getClientIp, sharedRateLimit } from "@/lib/rate-limit";
import { getRequiredSecret } from "@/lib/env";
import { createUserToken } from "@/lib/user-token";

export async function POST(req: NextRequest) {
  try {
    const limit = await sharedRateLimit(`auth-login:${getClientIp(req)}`, {
      limit: 10,
      windowMs: 15 * 60 * 1000,
    });
    if (!limit.success) {
      return NextResponse.json(
        { error: "Too many login attempts" },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
      );
    }

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (!verifyPassword(password, user.password, { legacySecret: getRequiredSecret("AUTH_SECRET") })) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (needsPasswordRehash(user.password)) {
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashPassword(password) },
      });
    }

    const token = await createUserToken(user);
    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
    });

    response.cookies.set("user_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
