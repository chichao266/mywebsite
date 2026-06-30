"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/cart-context";
import type { PaymentMethod } from "@/lib/payment-config";

type CheckoutResponse = {
  orderId?: string;
  paymentMethod?: PaymentMethod;
  redirectUrl?: string;
  error?: string;
};

function createCheckoutKey() {
  const browserCrypto = globalThis.crypto;
  if (browserCrypto?.randomUUID) {
    return browserCrypto.randomUUID();
  }
  const random = new Uint32Array(4);
  browserCrypto.getRandomValues(random);
  return Array.from(random, (value) => value.toString(36)).join("-");
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const checkoutKeyRef = useRef("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("paypal");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const shipping = totalPrice >= 150 ? 0 : 9.9;
  const total = totalPrice + shipping;

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    const requiredFields: Array<[keyof typeof form, string]> = [
      ["name", "Please enter your name."],
      ["email", "Please enter your email address."],
      ["address", "Please enter your shipping address."],
      ["city", "Please enter your city."],
      ["state", "Please enter your state or province."],
      ["zip", "Please enter your ZIP or postal code."],
    ];
    const nextFieldErrors = requiredFields.reduce<Record<string, string>>((errors, [field, message]) => {
      if (!form[field].trim()) errors[field] = message;
      return errors;
    }, {});

    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextFieldErrors.email = "Please enter a valid email address.";
    }

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      setError("Please complete the highlighted fields.");
      return;
    }

    setLoading(true);
    if (!checkoutKeyRef.current) {
      checkoutKeyRef.current = createCheckoutKey();
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          paymentMethod,
          checkoutKey: checkoutKeyRef.current,
          items: items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = (await res.json()) as CheckoutResponse;
      if (!res.ok) {
        setError(data.error || "Unable to place order.");
        return;
      }

      clearCart();
      checkoutKeyRef.current = "";
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }

      router.push(`/checkout/success?payment=${paymentMethod}&order=${data.orderId || ""}`);
    } catch {
      setError("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center sm:px-6">
        <h1 className="font-serif text-3xl font-bold">Checkout</h1>
        <p className="mt-4 text-muted-foreground">Your cart is empty.</p>
        <Button asChild className="mt-8">
          <Link href="/products">Browse Collection</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-10">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary/70">Secure order</p>
        <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight">Checkout</h1>
      </div>

      <form onSubmit={handleSubmit} noValidate className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <Card className="rounded-md border-border/60 p-6 shadow-none">
            <h2 className="font-serif text-xl font-semibold">Shipping details</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Name" value={form.name} onChange={(value) => update("name", value)} error={fieldErrors.name} required />
              <Field label="Email" type="email" value={form.email} onChange={(value) => update("email", value)} error={fieldErrors.email} required />
              <Field label="Address" value={form.address} onChange={(value) => update("address", value)} error={fieldErrors.address} required wide />
              <Field label="City" value={form.city} onChange={(value) => update("city", value)} error={fieldErrors.city} required />
              <Field label="State / Province" value={form.state} onChange={(value) => update("state", value)} error={fieldErrors.state} required />
              <Field label="ZIP / Postal code" value={form.zip} onChange={(value) => update("zip", value)} error={fieldErrors.zip} required />
            </div>
          </Card>

          <Card className="rounded-md border-border/60 p-6 shadow-none">
            <h2 className="font-serif text-xl font-semibold">Payment method</h2>
            <div className="mt-5 grid gap-3">
              <PaymentOption
                active={paymentMethod === "paypal"}
                title="PayPal"
                desc="Place the order and continue with PayPal. If a PayPal payment link is not configured yet, we will send a PayPal invoice manually."
                onClick={() => setPaymentMethod("paypal")}
              />
              <PaymentOption
                active={paymentMethod === "bank_transfer"}
                title="Bank transfer"
                desc="Place the order now, then pay by international bank transfer. We process the order after payment is confirmed."
                onClick={() => setPaymentMethod("bank_transfer")}
              />
            </div>
          </Card>
        </div>

        <Card className="h-fit rounded-md border-border/60 p-6 shadow-none lg:sticky lg:top-24">
          <h2 className="font-serif text-xl font-semibold">Order summary</h2>
          <div className="mt-5 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 text-sm">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
                  {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 font-medium">{item.name}</p>
                  <p className="mt-1 text-muted-foreground">Qty {item.quantity}</p>
                </div>
                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <Separator className="my-5" />
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-base font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
          <Button type="submit" size="lg" className="mt-6 w-full" disabled={loading}>
            {loading ? "Placing order..." : paymentMethod === "paypal" ? "Continue with PayPal" : "Place bank transfer order"}
          </Button>
          <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">
            We never collect card numbers on this site. PayPal and bank transfer are handled outside our checkout.
          </p>
        </Card>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  error,
  wide,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  error?: string;
  wide?: boolean;
}) {
  return (
    <label className={`block ${wide ? "sm:col-span-2" : ""}`}>
      <span className="text-sm font-medium">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-required={required}
        aria-invalid={Boolean(error)}
        className={`mt-2 w-full rounded-md border bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-foreground ${
          error ? "border-destructive" : "border-border"
        }`}
      />
      {error && <span className="mt-2 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

function PaymentOption({
  active,
  title,
  desc,
  onClick,
}: {
  active: boolean;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border p-4 text-left transition-colors ${
        active ? "border-foreground bg-foreground text-background" : "border-border bg-white hover:border-foreground/40"
      }`}
    >
      <span className="block text-sm font-semibold">{title}</span>
      <span className={`mt-2 block text-sm leading-6 ${active ? "text-background/75" : "text-muted-foreground"}`}>
        {desc}
      </span>
    </button>
  );
}
