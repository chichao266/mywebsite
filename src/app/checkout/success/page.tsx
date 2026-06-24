import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPaymentConfig, getPaymentLabel } from "@/lib/payment-config";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ payment?: string; order?: string }>;
}) {
  const { payment = "paypal", order } = await searchParams;
  const config = getPaymentConfig();
  const isBankTransfer = payment === "bank_transfer";

  return (
    <div className="container mx-auto px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary/70">
          Order received
        </p>
        <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          Thank You
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-muted-foreground">
          Your order has been placed with {getPaymentLabel(payment)}. We will prepare it after payment is confirmed.
        </p>
        {order && <p className="mt-3 text-sm text-muted-foreground">Order reference: {order}</p>}
      </div>

      <Card className="mx-auto mt-10 max-w-2xl rounded-md border-border/60 p-6 text-left shadow-none">
        {isBankTransfer ? (
          <div>
            <h2 className="font-serif text-xl font-semibold">Bank transfer instructions</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Please include your order reference in the transfer note. We will confirm your order once the transfer arrives.
            </p>
            <dl className="mt-6 grid gap-3 text-sm">
              <Info label="Account name" value={config.bankAccountName} />
              <Info label="Bank name" value={config.bankName} />
              <Info label="Account number" value={config.bankAccountNumber} />
              <Info label="SWIFT / BIC" value={config.bankSwift} />
              {config.bankIban && <Info label="IBAN" value={config.bankIban} />}
              {config.bankAddress && <Info label="Bank address" value={config.bankAddress} />}
            </dl>
          </div>
        ) : (
          <div>
            <h2 className="font-serif text-xl font-semibold">PayPal payment</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              If you were not redirected to PayPal, please send payment to the PayPal account below or contact us for an invoice.
            </p>
            <dl className="mt-6 grid gap-3 text-sm">
              <Info label="PayPal account" value={config.paypalEmail} />
              {config.paypalPaymentLink && <Info label="Payment link" value={config.paypalPaymentLink} />}
            </dl>
          </div>
        )}
      </Card>

      <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
        <Button asChild size="lg">
          <Link href="/products">Continue Shopping</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-b border-border/60 pb-3 sm:grid-cols-[160px_1fr]">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium break-words">{value}</dd>
    </div>
  );
}
