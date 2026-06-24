"use server";

import { prisma } from "@/lib/prisma";
import { rethrowInProduction } from "@/lib/admin-dev-fallbacks";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  } catch (error) {
    rethrowInProduction(error);
  }
  revalidatePath("/admin/orders");
}
