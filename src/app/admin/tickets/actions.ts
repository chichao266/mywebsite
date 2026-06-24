"use server";

import { prisma } from "@/lib/prisma";
import { demoTickets, rethrowInProduction } from "@/lib/admin-dev-fallbacks";
import { revalidatePath } from "next/cache";

export async function getTickets(statusFilter?: string) {
  const where = statusFilter ? { status: statusFilter } : {};
  try {
    return await prisma.supportTicket.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    rethrowInProduction(error);
    return demoTickets.filter((ticket) => !statusFilter || ticket.status === statusFilter);
  }
}

export async function updateTicketStatus(ticketId: string, status: string) {
  try {
    await prisma.supportTicket.update({
      where: { id: ticketId },
      data: { status },
    });
  } catch (error) {
    rethrowInProduction(error);
  }
  revalidatePath("/admin/tickets");
}
