export function isProductionDeployment() {
  if (process.env.VERCEL_ENV) {
    return process.env.VERCEL_ENV === "production";
  }

  return process.env.NODE_ENV === "production";
}

export function canUseDemoData() {
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
    content: "hello@avoryne.com",
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
      "Avoryne creates modern lab-grown diamond and colored gemstone jewelry for everyday polish.",
  },
  {
    id: "demo-our-story",
    key: "our_story",
    title: "品牌故事",
    content:
      "Avoryne was created for customers who want fine-jewelry polish with clearer material language. Our collection centers on lab-grown diamonds, sapphires, rubies, and emeralds.",
  },
  {
    id: "demo-contact-us",
    key: "contact_us",
    title: "联系我们",
    content: "Email hello@avoryne.com. We typically respond within one business day.",
  },
  {
    id: "demo-shipping",
    key: "shipping",
    title: "配送说明",
    content:
      "Each Avoryne piece is prepared with a final quality check before shipment. Standard international shipping usually takes 7-14 business days.",
  },
  {
    id: "demo-returns",
    key: "returns",
    title: "退换政策",
    content:
      "You may return unworn, non-custom items within 30 days of delivery. Custom orders and final sale items cannot be returned.",
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
