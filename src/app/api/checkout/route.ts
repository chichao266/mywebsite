import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

function getFirstImage(images: string): string | undefined {
  try {
    const parsed = JSON.parse(images);
    return Array.isArray(parsed) ? parsed[0] : undefined;
  } catch {
    return undefined;
  }
}

export async function GET() {
  try {
    // Fetch all cart items — in a real app, you'd pass cart items in the request
    // For this setup, we create a checkout with a default product
    const products = await prisma.product.findMany({ take: 1 });
    if (products.length === 0) {
      return NextResponse.json(
        { error: "No products available" },
        { status: 400 }
      );
    }

    const product = products[0];
    const productImage = getFirstImage(product.images);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              ...(productImage ? { images: [productImage] } : {}),
            },
            unit_amount: Math.round(product.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
      metadata: {
        productId: product.id,
      },
    });

    return NextResponse.redirect(session.url!);
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
