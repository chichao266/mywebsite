import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const limit = rateLimit(`support:${getClientIp(req)}`, {
      limit: 5,
      windowMs: 15 * 60 * 1000,
    });
    if (!limit.success) {
      return NextResponse.json(
        { error: "Too many submissions" },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
      );
    }

    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    await prisma.supportTicket.create({
      data: { name, email, subject, message },
    });

    return NextResponse.json({ success: true, message: "Ticket submitted. We'll get back to you soon!" });
  } catch {
    return NextResponse.json({ error: "Failed to submit ticket" }, { status: 500 });
  }
}
