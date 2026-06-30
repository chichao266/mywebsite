import { NextRequest, NextResponse } from "next/server";
import { AdminAuthError, requireAdminRequest } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { demoSiteSettings, rethrowInProduction } from "@/lib/admin-dev-fallbacks";
import { sanitizeHtml } from "@/lib/sanitize-html";

const DEFAULTS: Record<string, { title: string; content: string }> = {
  shipping: {
    title: "Shipping & Delivery",
    content: `<h2>Processing Time</h2><p>Each Avoryne order is prepared with a final quality check before shipment. Please allow <strong>2-3 business days</strong> for order processing before dispatch.</p><h2>Air Shipping</h2><p>Avoryne ships jewelry orders by air. After dispatch, delivery usually takes <strong>5-7 business days</strong>, depending on the destination, customs clearance, and carrier availability.</p><h2>Shipping Fees</h2><p>Standard air shipping is $9.90, with complimentary standard shipping on orders over $150.</p><h2>Tracking</h2><p>Once your order ships, we will send tracking details. Tracking updates may take 24-48 hours to appear after the carrier receives the package.</p><h2>Customs and Import Fees</h2><p>International customers are responsible for any customs duties, taxes, brokerage fees, or import charges required by the destination country.</p>`,
  },
  returns: {
    title: "Returns & Exchanges",
    content: `<h2>Return Window</h2><p>You may return unworn, unused, non-custom items within <strong>30 days</strong> of delivery. Items must be returned with their original packaging and any included certificates, cards, or accessories.</p><h2>How to Start a Return</h2><p>Submit a message through our support form with your order number and the item you would like to return. We will reply with return instructions within one business day.</p><h2>Non-Returnable Items</h2><p>Custom orders, personalized pieces, engraved items, final sale items, and items showing signs of wear cannot be returned unless they arrive damaged or defective.</p><h2>Refunds</h2><p>After we receive and inspect your return, approved refunds will be issued to the original payment method. Shipping fees, customs duties, and import fees are not refundable.</p><h2>Exchanges</h2><p>Exchanges may be available for eligible items within the return window, subject to stock availability.</p>`,
  },
  our_story: {
    title: "Our Story",
    content: `<p>Avoryne was created for customers who want the polish of fine jewelry with clearer material language. Our collection centers on lab-grown diamonds and lab-grown colored gemstones, edited into pieces that feel modern, wearable, and quietly refined.</p><p>We believe jewelry should be easy to understand: what the stone is, how it is described, and why the design belongs in an everyday wardrobe. Each product page is written to make material, color, cut, and care details clear before checkout.</p><p>Our style is clean and international: luminous stones, balanced proportions, and settings made for daily elegance rather than occasional ceremony.</p>`,
  },
  contact_us: {
    title: "Contact",
    content: `<h2>Contact Form</h2><p>Please use our support form for product questions, order support, and wholesale inquiries.</p><h2>Support Hours</h2><p>Monday to Friday. We typically respond within one business day.</p><h2>Order Help</h2><p>Please include your order number when contacting us about an existing order.</p>`,
  },
  privacy: {
    title: "Privacy Policy",
    content: `<p>Avoryne respects your privacy. This policy explains what information we collect, how we use it, and the choices you have when using our website.</p><h2>Information We Collect</h2><p>We may collect information you provide directly, such as your name, email address, shipping address, billing details, order information, and support messages. We may also collect technical information such as device type, browser, pages viewed, and general location data.</p><h2>How We Use Information</h2><p>We use your information to process orders, provide customer support, improve our website, prevent fraud, comply with legal obligations, and communicate with you about your purchases or account.</p><h2>Payments</h2><p>Payment information is processed by third-party payment providers. Avoryne does not intentionally store full payment card details on our website.</p><h2>Sharing Information</h2><p>We may share limited information with service providers that help us operate the store, including payment processors, shipping carriers, hosting providers, analytics tools, and customer support tools. We do not sell your personal information.</p><h2>Cookies</h2><p>Our website may use cookies and similar technologies to keep the site working, remember preferences, understand traffic, and improve the shopping experience.</p><h2>Your Choices</h2><p>You may contact us to request access, correction, or deletion of your personal information where applicable by law.</p><h2>Contact</h2><p>For privacy questions, please use our support form.</p>`,
  },
  terms: {
    title: "Terms of Service",
    content: `<p>These Terms of Service apply when you access Avoryne, browse our website, place an order, or contact us for support. By using the website, you agree to these terms.</p><h2>Products and Descriptions</h2><p>We aim to describe products accurately, including stone origin, material language, color, dimensions, and care notes. Product images may vary slightly because of lighting, screen settings, and natural differences in production.</p><h2>Orders</h2><p>Submitting an order does not guarantee acceptance. We may cancel or refuse an order if information is incomplete, payment cannot be confirmed, an item is unavailable, or fraud prevention checks require it.</p><h2>Pricing and Availability</h2><p>Prices, promotions, shipping fees, and availability may change without notice. If an error affects your order, we will contact you before proceeding.</p><h2>Payment</h2><p>Payment options may vary by launch phase and region. Orders are processed only after payment or approved manual payment instructions are confirmed.</p><h2>Shipping, Returns, and Exchanges</h2><p>Shipping and return terms are described on our Shipping & Delivery and Returns & Exchanges pages. International customers are responsible for applicable customs duties, taxes, and import fees.</p><h2>Use of the Website</h2><p>You agree not to misuse the website, attempt unauthorized access, interfere with store operations, or use the website for unlawful purposes.</p><h2>Limitation of Liability</h2><p>To the fullest extent permitted by law, Avoryne is not liable for indirect, incidental, or consequential damages arising from website use, order delays, third-party services, or product availability.</p><h2>Contact</h2><p>Questions about these terms can be sent through our support form.</p>`,
  },
};

function unauthorized(error: unknown) {
  if (error instanceof AdminAuthError) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

// GET — return all settings (create defaults if missing)
export async function GET(req: NextRequest) {
  try {
    await requireAdminRequest(req);
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
    const response = unauthorized(error);
    if (response) return response;
    rethrowInProduction(error);
    return NextResponse.json(demoSiteSettings);
  }
}

// PUT — update a setting
export async function PUT(req: NextRequest) {
  try {
    await requireAdminRequest(req);
    const body = await req.json();
    const { key, title, content } = body;
    const setting = await prisma.siteSetting.update({
      where: { key },
      data: { title, content: sanitizeHtml(String(content || "")) },
    });
    return NextResponse.json(setting);
  } catch (error) {
    const response = unauthorized(error);
    if (response) return response;
    rethrowInProduction(error);
    return NextResponse.json({ error: "Local preview database is unavailable." }, { status: 503 });
  }
}
