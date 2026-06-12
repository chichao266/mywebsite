import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const DEFAULTS: Record<string, { title: string; content: string }> = {
  shipping: {
    title: "Shipping & Delivery",
    content: `<h2>Processing Time</h2><p>Each Agatelier piece is hand-finished. Please allow <strong>2–3 business days</strong> for order processing before shipment.</p><h2>Shipping Options</h2><p>Standard International: 7–14 business days, $9.90 (free over $150)<br>Express International: 3–5 business days, $24.90<br>Domestic (China): 2–4 business days, free</p><h2>Tracking</h2><p>You will receive a confirmation email with a tracking number as soon as your order ships.</p>`,
  },
  returns: {
    title: "Returns & Exchanges",
    content: `<h2>Return Window</h2><p>You may return any item within <strong>30 days</strong> of delivery for a full refund.</p><h2>How to Return</h2><p>Email us at hello@agatelier.com with your order number. We will send return instructions within 24 hours.</p><h2>Exchanges</h2><p>One complimentary exchange per order within 30 days.</p>`,
  },
  about: {
    title: "Our Story",
    content: `<p>Agatelier was born from a simple belief: that every piece of natural stone deserves to be seen — not as a commodity, but as a fragment of the earth with its own story.</p><p>We work with family-run workshops in China's historic stone-carving regions.</p>`,
  },
  contact: {
    title: "Contact",
    content: `<h2>Email</h2><p>hello@agatelier.com</p><h2>WhatsApp</h2><p>+86 138 0000 0000</p>`,
  },
};

export async function getSetting(key: string): Promise<{ title: string; content: string }> {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key } });
    if (setting) return { title: setting.title, content: setting.content };
  } catch {}
  return DEFAULTS[key] || { title: key, content: "" };
}
