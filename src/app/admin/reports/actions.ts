"use server";

import { prisma } from "@/lib/prisma";
import { demoProducts } from "@/lib/demo-products";

export async function getStats() {
  try {
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
  } catch {
    if (process.env.NODE_ENV === "production") throw new Error("Database is required in production.");

    const categories = new Map<string, number>();
    for (const product of demoProducts) {
      categories.set(product.category, (categories.get(product.category) || 0) + 1);
    }

    return {
      totalProducts: demoProducts.length,
      totalOrders: 0,
      totalUsers: 1,
      totalRevenue: 0,
      ordersByStatus: [],
      productsByCategory: Array.from(categories.entries()).map(([category, count]) => ({
        category,
        _count: count,
      })),
      recentOrders: [],
    };
  }
}
