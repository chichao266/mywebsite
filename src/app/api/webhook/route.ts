import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET ?? ""
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Save order to database
    if (session.customer_details) {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

      await prisma.order.create({
        data: {
          customerName: session.customer_details.name ?? "Unknown",
          customerEmail: session.customer_details.email ?? "unknown@example.com",
          address: session.customer_details.address?.line1 ?? "",
          city: session.customer_details.address?.city ?? "",
          state: session.customer_details.address?.state ?? "",
          zip: session.customer_details.address?.postal_code ?? "",
          total: (session.amount_total ?? 0) / 100,
          status: "paid",
          stripeSessionId: session.id,
          items: {
            create: lineItems.data.map((item) => ({
              productId: item.price?.product as string,
              quantity: item.quantity ?? 1,
              price: (item.price?.unit_amount ?? 0) / 100,
            })),
          },
        },
      });
    }
  }

  return NextResponse.json({ received: true });
}
