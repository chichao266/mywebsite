import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const DEFAULTS: Record<string, { title: string; content: string }> = {
  shipping: {
    title: "Shipping & Delivery",
    content: `<h2>Processing Time</h2><p>Each Lumea piece is prepared with a final quality check before shipment. Please allow <strong>2-3 business days</strong> for order processing.</p><h2>Shipping Options</h2><p>Standard International: 7-14 business days, $9.90 (free over $150)<br>Express International: 3-5 business days, $24.90</p><h2>Tracking</h2><p>You will receive a confirmation email with tracking details as soon as your order ships.</p>`,
  },
  returns: {
    title: "Returns & Exchanges",
    content: `<h2>Return Window</h2><p>You may return unworn, non-custom items within <strong>30 days</strong> of delivery.</p><h2>How to Return</h2><p>Email us at hello@lumeajewelry.com with your order number. We will send return instructions within one business day.</p><h2>Exchanges</h2><p>One complimentary exchange per order within 30 days.</p>`,
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

export async function getSetting(key: string): Promise<{ title: string; content: string }> {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key } });
    if (setting) return { title: setting.title, content: setting.content };
  } catch {}
  return DEFAULTS[key] || { title: key, content: "" };
}
