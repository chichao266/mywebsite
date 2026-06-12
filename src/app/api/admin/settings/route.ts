import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULTS: Record<string, { title: string; content: string }> = {
  shipping: {
    title: "Shipping & Delivery",
    content: `<h2>Processing Time</h2><p>Each Agatelier piece is hand-finished. Please allow <strong>2–3 business days</strong> for order processing before shipment.</p><h2>Shipping Options</h2><p>Standard International: 7–14 business days, $9.90 (free over $150)<br>Express International: 3–5 business days, $24.90<br>Domestic (China): 2–4 business days, free</p><h2>Tracking</h2><p>You will receive a confirmation email with a tracking number as soon as your order ships.</p><h2>International Orders</h2><p>International customers are responsible for any customs duties, taxes, or import fees.</p><h2>Insurance</h2><p>All orders over $100 include complimentary shipping insurance.</p>`,
  },
  returns: {
    title: "Returns & Exchanges",
    content: `<h2>Our Promise</h2><p>We want you to love your Agatelier piece. Every item is natural stone, hand-carved by skilled artisans.</p><h2>Return Window</h2><p>You may return any item within <strong>30 days</strong> of delivery for a full refund.</p><h2>How to Return</h2><p>Email us at hello@agatelier.com with your order number. We will send return instructions within 24 hours. Once we receive the piece, your refund is processed within 5 business days.</p><h2>Exchanges</h2><p>One complimentary exchange per order within 30 days. We cover exchange shipping both ways.</p><h2>Non-Returnable Items</h2><p>Custom orders, personalized engravings, and final sale items cannot be returned.</p>`,
  },
  about: {
    title: "Our Story",
    content: `<p>Agatelier was born from a simple belief: that every piece of natural stone deserves to be seen — not as a commodity, but as a fragment of the earth with its own story.</p><p>We work with family-run workshops in China's historic stone-carving regions. These are not factories. They are homes where craft has been passed down through four generations.</p><p>When you hold a Agatelier piece, you are holding something that took millions of years to form and weeks of patient hands to finish.</p>`,
  },
  contact: {
    title: "Contact",
    content: `<h2>Email</h2><p>hello@agatelier.com — we respond within 24 hours.</p><h2>WhatsApp</h2><p>+86 138 0000 0000 — available 9:00–18:00 Beijing time (UTC+8).</p>`,
  },
};

// GET — return all settings (create defaults if missing)
export async function GET() {
  const existing = await prisma.siteSetting.findMany();
  const existingKeys = new Set(existing.map((s) => s.key));

  // Create any missing defaults
  for (const [key, val] of Object.entries(DEFAULTS)) {
    if (!existingKeys.has(key)) {
      await prisma.siteSetting.create({
        data: { key, title: val.title, content: val.content },
      });
    }
  }

  const settings = await prisma.siteSetting.findMany({
    orderBy: { key: "asc" },
  });
  return NextResponse.json(settings);
}

// PUT — update a setting
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { key, title, content } = body;
  const setting = await prisma.siteSetting.update({
    where: { key },
    data: { title, content },
  });
  return NextResponse.json(setting);
}
