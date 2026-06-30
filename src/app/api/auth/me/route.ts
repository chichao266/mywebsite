import { NextRequest, NextResponse } from "next/server";
import { requireUserRequest } from "@/lib/user-auth";

export async function GET(req: NextRequest) {
  try {
    const user = await requireUserRequest(req);
    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
