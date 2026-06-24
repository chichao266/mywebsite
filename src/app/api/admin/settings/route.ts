import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { demoSiteSettings, rethrowInProduction } from "@/lib/admin-dev-fallbacks";

const DEFAULTS: Record<string, { title: string; content: string }> = {
  shipping: {
    title: "Shipping & Delivery",
    content: `<h2>Processing Time</h2><p>Each Lumea piece is prepared with a final quality check before shipment. Please allow <strong>2-3 business days</strong> for order processing.</p><h2>Shipping Options</h2><p>Standard International: 7-14 business days, $9.90 (free over $150)<br>Express International: 3-5 business days, $24.90</p><h2>Tracking</h2><p>You will receive a confirmation email with tracking details as soon as your order ships.</p><h2>International Orders</h2><p>International customers are responsible for any customs duties, taxes, or import fees.</p>`,
  },
  returns: {
    title: "Returns & Exchanges",
    content: `<h2>Our Promise</h2><p>We want you to love your Lumea piece. Lab-grown gemstones are disclosed clearly on product pages.</p><h2>Return Window</h2><p>You may return unworn, non-custom items within <strong>30 days</strong> of delivery.</p><h2>How to Return</h2><p>Email us at hello@lumeajewelry.com with your order number. We will send return instructions within one business day.</p><h2>Non-Returnable Items</h2><p>Custom orders, personalized engravings, and final sale items cannot be returned.</p>`,
  },
  about: {
    title: "Our Story",
    content: `<p>Lumea was created for customers who want the polish of fine jewelry with clearer material language. Our collection centers on lab-grown diamonds, sapphires, rubies, and emeralds, edited into pieces that feel modern rather than ceremonial.</p><p>We believe jewelry should be easy to understand: what the stone is, how it is made, and why the design belongs in an everyday wardrobe.</p>`,
  },
  contact: {
    title: "Contact",
    content: `<h2>Email</h2><p>hello@lumeajewelry.com</p><h2>Support</h2><p>We typically respond within one business day.</p>`,
  },
};

// GET — return all settings (create defaults if missing)
export async function GET() {
  try {
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
  } catch (error) {
    rethrowInProduction(error);
    return NextResponse.json(demoSiteSettings);
  }
}

// PUT — update a setting
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { key, title, content } = body;
  try {
    const setting = await prisma.siteSetting.update({
      where: { key },
      data: { title, content },
    });
    return NextResponse.json(setting);
  } catch (error) {
    rethrowInProduction(error);
    return NextResponse.json({ key, title, content });
  }
}
