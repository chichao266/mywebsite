import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserAuthError, requireUserRequest } from "@/lib/user-auth";

export async function PUT(req: NextRequest) {
  try {
    const user = await requireUserRequest(req);
    const { name } = await req.json();
    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { name: name.trim() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof UserAuthError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
