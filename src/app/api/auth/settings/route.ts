import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createHmac } from "crypto";
import { getOptionalSecret } from "@/lib/env";

function getUserId(req: NextRequest): string | null {
  const token = req.cookies.get("user_token")?.value;
  if (!token) return null;
  try {
    const secret = getOptionalSecret("AUTH_SECRET");
    if (!secret) return null;

    const parts = token.split(":");
    if (parts.length < 3) return null;
    const userId = parts[0];
    const signature = parts[parts.length - 1];
    const payload = parts.slice(0, -1).join(":");
    const expected = createHmac("sha256", secret).update(payload).digest("hex");
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

export async function PUT(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name } = await req.json();
    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { name: name.trim() },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
