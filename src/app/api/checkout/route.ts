import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isProductionDeployment } from "@/lib/admin-dev-fallbacks";
import { notifyAdminOfNewOrder } from "@/lib/admin-notifications";
import { getPaymentConfig, type PaymentMethod } from "@/lib/payment-config";
import { getClientIp, sharedRateLimit } from "@/lib/rate-limit";

type CheckoutItem = {
  id: string;
  quantity: number;
};

type CheckoutBody = {
  paymentMethod?: PaymentMethod;
  checkoutKey?: string;
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

class CheckoutError extends Error {
  constructor(
    message: string,
    public status = 400
  ) {
    super(message);
  }
}

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isPaymentMethod(value: unknown): value is PaymentMethod {
  return value === "paypal" || value === "bank_transfer";
}

function normalizeCheckoutKey(value: unknown) {
  const key = clean(value);
  return /^[a-zA-Z0-9_-]{16,80}$/.test(key) ? key : "";
}

function normalizeItems(items: CheckoutItem[] | undefined) {
  const totals = new Map<string, number>();

  for (const item of items || []) {
    const id = clean(item.id);
    const quantity = Number(item.quantity);
    if (!id || !Number.isInteger(quantity) || quantity <= 0) continue;
    totals.set(id, (totals.get(id) || 0) + quantity);
  }

  return Array.from(totals, ([id, quantity]) => ({ id, quantity }));
}

function isUniqueConstraintError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

export async function POST(req: NextRequest) {
  const limit = await sharedRateLimit(`checkout:${getClientIp(req)}`, {
    limit: 8,
    windowMs: 10 * 60 * 1000,
  });
  if (!limit.success) {
    return NextResponse.json(
      { error: "Too many checkout attempts. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

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

  const checkoutKey = normalizeCheckoutKey(body.checkoutKey);
  if (!checkoutKey) {
    return NextResponse.json({ error: "Please refresh checkout and try again." }, { status: 400 });
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
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const requestedItems = normalizeItems(body.items);
  if (requestedItems.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }
  if (requestedItems.length > 30 || requestedItems.some((item) => item.quantity > 20)) {
    return NextResponse.json({ error: "Please reduce the cart quantity and try again." }, { status: 400 });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const existingOrder = await tx.order.findUnique({
        where: { checkoutKey },
        include: { items: { include: { product: true } } },
      });
      if (existingOrder) {
        return { order: existingOrder, reused: true };
      }

      const products = await tx.product.findMany({
        where: { id: { in: requestedItems.map((item) => item.id) } },
      });
      const productsById = new Map(products.map((product) => [product.id, product]));

      const resolvedItems = requestedItems.map((item) => {
        const product = productsById.get(item.id);
        if (!product) throw new CheckoutError("One product is no longer available.");
        return { product, quantity: item.quantity };
      });

      for (const item of resolvedItems) {
        const stockUpdate = await tx.product.updateMany({
          where: { id: item.product.id, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });

        if (stockUpdate.count !== 1) {
          throw new CheckoutError(`${item.product.name} does not have enough stock.`);
        }
      }

      const subtotal = resolvedItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      const shipping = subtotal >= 150 ? 0 : 9.9;
      const total = subtotal + shipping;

      const order = await tx.order.create({
        data: {
          checkoutKey,
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
        include: { items: { include: { product: true } } },
      });

      return { order, reused: false };
    });

    if (!result.reused) {
      await notifyAdminOfNewOrder({
        id: result.order.id,
        customerName,
        customerEmail,
        address,
        city,
        state,
        zip,
        total: result.order.total,
        paymentMethod,
        items: result.order.items.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.price,
        })),
      });
    }

    const orderPaymentMethod = isPaymentMethod(result.order.paymentMethod)
      ? result.order.paymentMethod
      : paymentMethod;

    const config = getPaymentConfig();
    if (orderPaymentMethod === "paypal" && config.paypalPaymentLink) {
      return NextResponse.json({
        orderId: result.order.id,
        paymentMethod: orderPaymentMethod,
        redirectUrl: config.paypalPaymentLink,
      });
    }

    return NextResponse.json({ orderId: result.order.id, paymentMethod: orderPaymentMethod });
  } catch (error) {
    if (error instanceof CheckoutError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    if (isUniqueConstraintError(error)) {
      const existingOrder = await prisma.order.findUnique({ where: { checkoutKey } });
      if (existingOrder) {
        const orderPaymentMethod = isPaymentMethod(existingOrder.paymentMethod)
          ? existingOrder.paymentMethod
          : paymentMethod;
        const config = getPaymentConfig();
        if (orderPaymentMethod === "paypal" && config.paypalPaymentLink) {
          return NextResponse.json({
            orderId: existingOrder.id,
            paymentMethod: orderPaymentMethod,
            redirectUrl: config.paypalPaymentLink,
          });
        }
        return NextResponse.json({ orderId: existingOrder.id, paymentMethod: orderPaymentMethod });
      }
    }

    if (isProductionDeployment()) {
      throw error;
    }

    return NextResponse.json({
      orderId: `preview-${Date.now()}`,
      paymentMethod,
    });
  }
}
