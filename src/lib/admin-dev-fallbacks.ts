export function isProductionDeployment() {
  if (process.env.VERCEL_ENV) {
    return process.env.VERCEL_ENV === "production";
  }

  return process.env.NODE_ENV === "production";
}

export function canUseDemoData() {
  if (process.env.ENABLE_DEMO_DATA === "true") {
    return true;
  }

  return !isProductionDeployment();
}

export function rethrowInProduction(error: unknown) {
  if (isProductionDeployment()) {
    throw error;
  }
}

const now = new Date("2026-06-24T00:00:00.000Z");

export const demoSystemSettings = [
  {
    id: "demo-system-site-name",
    key: "system_site_name",
    title: "站点名称",
    content: "Avoryne",
  },
  {
    id: "demo-system-site-desc",
    key: "system_site_desc",
    title: "站点描述",
    content: "Lab-grown diamond and colored gemstone jewelry",
  },
  {
    id: "demo-system-contact-email",
    key: "system_contact_email",
    title: "联系邮箱",
    content: "",
  },
  {
    id: "demo-system-phone",
    key: "system_phone",
    title: "联系电话",
    content: "+1 888 555 0198",
  },
  {
    id: "demo-system-address",
    key: "system_address",
    title: "公司地址",
    content: "International online studio",
  },
  {
    id: "demo-system-currency",
    key: "system_currency",
    title: "货币符号",
    content: "$",
  },
];

export const demoSiteSettings = [
  {
    id: "demo-brand-intro",
    key: "brand_intro",
    title: "品牌简介",
    content:
      "Avoryne creates modern lab-grown diamond and colored gemstone jewelry with clear material language and everyday polish.",
  },
  {
    id: "demo-our-story",
    key: "our_story",
    title: "品牌故事",
    content:
      "<p>Avoryne was created for customers who want the polish of fine jewelry with clearer material language. Our collection centers on lab-grown diamonds and lab-grown colored gemstones, edited into pieces that feel modern, wearable, and quietly refined.</p><p>We believe jewelry should be easy to understand: what the stone is, how it is described, and why the design belongs in an everyday wardrobe.</p>",
  },
  {
    id: "demo-contact-us",
    key: "contact_us",
    title: "联系我们",
    content:
      "<h2>Contact Form</h2><p>Please use our support form for product questions, order support, and wholesale inquiries.</p><h2>Support Hours</h2><p>Monday to Friday. We typically respond within one business day.</p>",
  },
  {
    id: "demo-shipping",
    key: "shipping",
    title: "配送说明",
    content:
      "<h2>Processing Time</h2><p>Each Avoryne order is prepared with a final quality check before shipment. Please allow 2-3 business days for order processing before dispatch.</p><h2>Air Shipping</h2><p>Avoryne ships jewelry orders by air. After dispatch, delivery usually takes 5-7 business days, depending on the destination, customs clearance, and carrier availability.</p>",
  },
  {
    id: "demo-returns",
    key: "returns",
    title: "退换政策",
    content:
      "<h2>Return Window</h2><p>You may return unworn, unused, non-custom items within 30 days of delivery.</p><h2>Non-Returnable Items</h2><p>Custom orders, personalized pieces, final sale items, and items showing signs of wear cannot be returned unless they arrive damaged or defective.</p>",
  },
  {
    id: "demo-privacy",
    key: "privacy",
    title: "隐私政策",
    content:
      "<p>Avoryne respects your privacy. We use customer information to process orders, provide support, improve the website, prevent fraud, and comply with legal obligations.</p>",
  },
  {
    id: "demo-terms",
    key: "terms",
    title: "服务条款",
    content:
      "<p>These Terms of Service apply when you access Avoryne, browse our website, place an order, or contact us for support.</p>",
  },
  {
    id: "demo-faq",
    key: "faq",
    title: "常见问题",
    content:
      "Our stones are lab-grown and clearly disclosed on each product page. Care instructions are included with every piece.",
  },
  ...demoSystemSettings,
];

export const demoUsers = [
  {
    id: "demo-admin-user",
    email: "admin@avoryne.com",
    password: "",
    name: "Avoryne Admin",
    role: "admin",
    createdAt: now,
    updatedAt: now,
  },
];

export const demoTickets = [
  {
    id: "demo-ticket-1",
    name: "Preview Customer",
    email: "customer@example.com",
    subject: "Question about lab-grown sapphires",
    message:
      "I would like to know whether the sapphire ring can be resized before shipping.",
    status: "open",
    createdAt: now,
  },
];
