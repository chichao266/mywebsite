import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createHmac, randomBytes } from "crypto";
import { hashPassword, needsPasswordRehash, verifyPassword } from "@/lib/password";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { getRequiredSecret } from "@/lib/env";

function createToken(userId: string): string {
  const payload = `${userId}:${Date.now()}:${randomBytes(8).toString("hex")}`;
  const signature = createHmac("sha256", getRequiredSecret("AUTH_SECRET")).update(payload).digest("hex");
  return `${payload}:${signature}`;
}

export async function POST(req: NextRequest) {
  try {
    const limit = rateLimit(`auth-login:${getClientIp(req)}`, {
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

    const token = createToken(user.id);
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
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
