import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createHmac } from "crypto";

const SECRET = process.env.AUTH_SECRET || "agatelier-auth-secret-change-me";

function verifyToken(token: string): string | null {
  try {
    const parts = token.split(":");
    if (parts.length < 3) return null;
    const userId = parts[0];
    const signature = parts[parts.length - 1];
    const payload = parts.slice(0, -1).join(":");
    const expected = createHmac("sha256", SECRET).update(payload).digest("hex");

    if (signature.length !== expected.length) return null;
    let ok = 0;
    for (let i = 0; i < signature.length; i++) {
      ok |= signature.charCodeAt(i) ^ expected.charCodeAt(i);
    }
    return ok === 0 ? userId : null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get("user_token")?.value;
  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const userId = verifyToken(token);
  if (!userId) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
