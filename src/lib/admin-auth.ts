import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/admin-token";

export class AdminAuthError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "AdminAuthError";
  }
}

async function requireAdminFromToken(token: string | undefined) {
  if (!token) throw new AdminAuthError();

  const payload = await verifyAdminToken(token);
  if (!payload) throw new AdminAuthError();

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, role: true },
  });

  if (!user || user.email !== payload.email || user.role !== "admin") {
    throw new AdminAuthError();
  }

  return user;
}

export async function requireAdmin() {
  const cookieStore = await cookies();
  return requireAdminFromToken(cookieStore.get("admin_token")?.value);
}

export async function requireAdminRequest(request: NextRequest) {
  return requireAdminFromToken(request.cookies.get("admin_token")?.value);
}
