import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Stripe webhook is disabled. Use PayPal or bank transfer checkout." },
    { status: 410 }
  );
}
