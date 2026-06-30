import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyUserToken } from "@/lib/user-token";

export class UserAuthError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UserAuthError";
  }
}

export async function requireUserRequest(request: NextRequest) {
  const token = request.cookies.get("user_token")?.value;
  if (!token) throw new UserAuthError();

  const payload = await verifyUserToken(token);
  if (!payload) throw new UserAuthError();

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, name: true, role: true },
  });

  if (!user || user.email !== payload.email || user.role !== payload.role) {
    throw new UserAuthError();
  }

  return user;
}
