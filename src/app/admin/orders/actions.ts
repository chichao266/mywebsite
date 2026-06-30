"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { rethrowInProduction } from "@/lib/admin-dev-fallbacks";
import { revalidatePath } from "next/cache";

const ORDER_STATUSES = new Set([
  "pending_payment",
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await requireAdmin();
    if (!ORDER_STATUSES.has(status)) {
      throw new Error("Invalid order status.");
    }

    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });
      if (!order) throw new Error("Order not found.");

      if (order.status === status) return;

      if (status === "cancelled" && order.status !== "cancelled") {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }

      if (order.status === "cancelled" && status !== "cancelled") {
        for (const item of order.items) {
          const stockUpdate = await tx.product.updateMany({
            where: { id: item.productId, stock: { gte: item.quantity } },
            data: { stock: { decrement: item.quantity } },
          });
          if (stockUpdate.count !== 1) {
            throw new Error("Insufficient stock to reopen this order.");
          }
        }
      }

      await tx.order.update({
        where: { id: orderId },
        data: { status },
      });
    });
  } catch (error) {
    rethrowInProduction(error);
  }
  revalidatePath("/admin/orders");
}
