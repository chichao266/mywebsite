"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { demoUsers, rethrowInProduction } from "@/lib/admin-dev-fallbacks";
import { revalidatePath } from "next/cache";

export async function getUsers(page = 1, pageSize = 20) {
  const requestedPage = Math.max(1, Math.floor(page));
  const safePageSize = Math.max(1, Math.floor(pageSize));

  try {
    await requireAdmin();
    const totalCount = await prisma.user.count();
    const totalPages = Math.max(1, Math.ceil(totalCount / safePageSize));
    const activePage = Math.min(requestedPage, totalPages);
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      skip: (activePage - 1) * safePageSize,
      take: safePageSize,
    });

    return { users, page: activePage, pageSize: safePageSize, totalCount, totalPages };
  } catch (error) {
    rethrowInProduction(error);
    const totalCount = demoUsers.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / safePageSize));
    const activePage = Math.min(requestedPage, totalPages);
    const start = (activePage - 1) * safePageSize;

    return {
      users: demoUsers.slice(start, start + safePageSize),
      page: activePage,
      pageSize: safePageSize,
      totalCount,
      totalPages,
    };
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
