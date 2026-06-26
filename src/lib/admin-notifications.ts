import { getPaymentLabel } from "@/lib/payment-config";

type OrderNotificationItem = {
  name: string;
  quantity: number;
  price: number;
};

type OrderNotification = {
  id: string;
  customerName: string;
  customerEmail: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  total: number;
  paymentMethod: string;
  items: OrderNotificationItem[];
};

type TicketNotification = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getNotificationRecipients() {
  return (process.env.ADMIN_NOTIFICATION_EMAIL || "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

async function sendAdminEmail(subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const recipients = getNotificationRecipients();

  if (!apiKey || recipients.length === 0) {
    return;
  }

  const from = process.env.ADMIN_NOTIFICATION_FROM || "Avoryne <onboarding@resend.dev>";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: recipients,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    throw new Error(`Email notification failed with status ${response.status}`);
  }
}

export async function notifyAdminOfNewOrder(order: OrderNotification) {
  const itemRows = order.items
    .map(
      (item) =>
        `<li>${escapeHtml(item.name)} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>`
    )
    .join("");

  try {
    await sendAdminEmail(
      `New order received - ${order.id}`,
      `
        <h2>New order received</h2>
        <p><strong>Order ID:</strong> ${escapeHtml(order.id)}</p>
        <p><strong>Customer:</strong> ${escapeHtml(order.customerName)} (${escapeHtml(order.customerEmail)})</p>
        <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
        <p><strong>Payment method:</strong> ${escapeHtml(getPaymentLabel(order.paymentMethod))}</p>
        <h3>Items</h3>
        <ul>${itemRows}</ul>
        <h3>Shipping address</h3>
        <p>${escapeHtml(order.address)}<br />${escapeHtml(order.city)}, ${escapeHtml(order.state)} ${escapeHtml(order.zip)}</p>
        <p><a href="https://www.avoryne.net/admin/orders">Open admin orders</a></p>
      `
    );
  } catch (error) {
    console.error("Failed to send order notification", error);
  }
}

export async function notifyAdminOfNewTicket(ticket: TicketNotification) {
  try {
    await sendAdminEmail(
      `New support message - ${ticket.subject}`,
      `
        <h2>New support message</h2>
        <p><strong>Ticket ID:</strong> ${escapeHtml(ticket.id)}</p>
        <p><strong>From:</strong> ${escapeHtml(ticket.name)} (${escapeHtml(ticket.email)})</p>
        <p><strong>Subject:</strong> ${escapeHtml(ticket.subject)}</p>
        <h3>Message</h3>
        <p>${escapeHtml(ticket.message).replace(/\n/g, "<br />")}</p>
        <p><a href="https://www.avoryne.net/admin/tickets">Open admin tickets</a></p>
      `
    );
  } catch (error) {
    console.error("Failed to send support ticket notification", error);
  }
}
