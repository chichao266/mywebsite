"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { demoTickets, rethrowInProduction } from "@/lib/admin-dev-fallbacks";
import { revalidatePath } from "next/cache";

export async function getTickets(statusFilter?: string, page = 1, pageSize = 20) {
  const where = statusFilter ? { status: statusFilter } : {};
  const requestedPage = Math.max(1, Math.floor(page));
  const safePageSize = Math.max(1, Math.floor(pageSize));

  try {
    await requireAdmin();
    const totalCount = await prisma.supportTicket.count({ where });
    const totalPages = Math.max(1, Math.ceil(totalCount / safePageSize));
    const activePage = Math.min(requestedPage, totalPages);
    const tickets = await prisma.supportTicket.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (activePage - 1) * safePageSize,
      take: safePageSize,
    });

    return { tickets, page: activePage, pageSize: safePageSize, totalCount, totalPages };
  } catch (error) {
    rethrowInProduction(error);
    const matchingTickets = demoTickets.filter((ticket) => !statusFilter || ticket.status === statusFilter);
    const totalCount = matchingTickets.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / safePageSize));
    const activePage = Math.min(requestedPage, totalPages);
    const start = (activePage - 1) * safePageSize;

    return {
      tickets: matchingTickets.slice(start, start + safePageSize),
      page: activePage,
      pageSize: safePageSize,
      totalCount,
      totalPages,
    };
  }
}

export async function updateTicketStatus(ticketId: string, status: string) {
  try {
    await requireAdmin();
    await prisma.supportTicket.update({
      where: { id: ticketId },
      data: { status },
    });
  } catch (error) {
    rethrowInProduction(error);
  }
  revalidatePath("/admin/tickets");
}
