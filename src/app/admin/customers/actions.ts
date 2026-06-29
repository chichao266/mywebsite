"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { demoUsers, rethrowInProduction } from "@/lib/admin-dev-fallbacks";
import { revalidatePath } from "next/cache";

export async function getUsers() {
  try {
    await requireAdmin();
    return await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    rethrowInProduction(error);
    return demoUsers;
  }
}

export async function updateUserRole(userId: string, role: string) {
  try {
    await requireAdmin();
    await prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  } catch (error) {
    rethrowInProduction(error);
  }
  revalidatePath("/admin/customers");
}
