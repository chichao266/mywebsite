import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isProductionDeployment } from "@/lib/admin-dev-fallbacks";
import { notifyAdminOfNewOrder } from "@/lib/admin-notifications";
import { getPaymentConfig, type PaymentMethod } from "@/lib/payment-config";
import { getProductById } from "@/lib/product-data";

type CheckoutItem = {
  id: string;
  quantity: number;
};

type CheckoutBody = {
  paymentMethod?: PaymentMethod;
  customer?: {
    name?: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  items?: CheckoutItem[];
};

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isPaymentMethod(value: unknown): value is PaymentMethod {
  return value === "paypal" || value === "bank_transfer";
}

export async function POST(req: NextRequest) {
  let body: CheckoutBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid checkout request." }, { status: 400 });
  }

  const paymentMethod = body.paymentMethod;
  if (!isPaymentMethod(paymentMethod)) {
    return NextResponse.json({ error: "Please choose a payment method." }, { status: 400 });
  }

  const customer = body.customer || {};
  const customerName = clean(customer.name);
  const customerEmail = clean(customer.email);
  const address = clean(customer.address);
  const city = clean(customer.city);
  const state = clean(customer.state);
  const zip = clean(customer.zip);

  if (!customerName || !customerEmail || !address || !city || !state || !zip) {
    return NextResponse.json({ error: "Please complete shipping details." }, { status: 400 });
  }

  const requestedItems = (body.items || []).filter((item) => item.id && item.quantity > 0);
  if (requestedItems.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  const resolvedItems = [];
  for (const item of requestedItems) {
    const product = await getProductById(item.id);
    if (!product) {
      return NextResponse.json({ error: "One product is no longer available." }, { status: 400 });
    }
    if (product.stock < item.quantity) {
      return NextResponse.json(
        { error: `${product.name} has only ${product.stock} in stock.` },
        { status: 400 }
      );
    }
    resolvedItems.push({ product, quantity: item.quantity });
  }

  const subtotal = resolvedItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal >= 150 ? 0 : 9.9;
  const total = subtotal + shipping;

  try {
    const order = await prisma.order.create({
      data: {
        customerName,
        customerEmail,
        address,
        city,
        state,
        zip,
        total,
        status: "pending_payment",
        paymentMethod,
        items: {
          create: resolvedItems.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
    });

    await notifyAdminOfNewOrder({
      id: order.id,
      customerName,
      customerEmail,
      address,
      city,
      state,
      zip,
      total,
      paymentMethod,
      items: resolvedItems.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
    });

    const config = getPaymentConfig();
    if (paymentMethod === "paypal" && config.paypalPaymentLink) {
      return NextResponse.json({
        orderId: order.id,
        paymentMethod,
        redirectUrl: config.paypalPaymentLink,
      });
    }

    return NextResponse.json({ orderId: order.id, paymentMethod });
  } catch (error) {
    if (isProductionDeployment()) {
      throw error;
    }

    return NextResponse.json({
      orderId: `preview-${Date.now()}`,
      paymentMethod,
    });
  }
}
