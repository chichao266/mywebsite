"use server";

import { prisma } from "@/lib/prisma";

export async function getStats() {
  const [
    totalProducts,
    totalOrders,
    totalUsers,
    totalRevenue,
    ordersByStatus,
    productsByCategory,
    recentOrders,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { not: "cancelled" } },
    }),
    prisma.order.groupBy({ by: ["status"], _count: true }),
    prisma.product.groupBy({ by: ["category"], _count: true }),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: { total: true, createdAt: true },
    }),
  ]);

  return {
    totalProducts,
    totalOrders,
    totalUsers,
    totalRevenue: totalRevenue._sum.total || 0,
    ordersByStatus,
    productsByCategory,
    recentOrders,
  };
}
