import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createHmac, randomBytes } from "crypto";
import { hashPassword } from "@/lib/password";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const SECRET = process.env.AUTH_SECRET || "agatelier-auth-secret-change-me";

function createToken(userId: string): string {
  const payload = `${userId}:${Date.now()}:${randomBytes(8).toString("hex")}`;
  const signature = createHmac("sha256", SECRET).update(payload).digest("hex");
  return `${payload}:${signature}`;
}

export async function POST(req: NextRequest) {
  try {
    const limit = rateLimit(`auth-register:${getClientIp(req)}`, {
      limit: 5,
      windowMs: 15 * 60 * 1000,
    });
    if (!limit.success) {
      return NextResponse.json(
        { error: "Too many registration attempts" },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
      );
    }

    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: { email, password: hashPassword(password), name },
    });

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
  } catch {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
