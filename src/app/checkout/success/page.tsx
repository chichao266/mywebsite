import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-20 text-center">
      {/* Success Icon */}
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
        Thank You
      </h1>
      <p className="mt-4 text-muted-foreground text-base sm:text-lg max-w-md mx-auto leading-relaxed">
        Your order has been placed. You&apos;ll receive a confirmation email
        shortly with tracking details once your piece leaves the workshop.
      </p>

      <p className="mt-2 text-sm text-muted-foreground">
        Each Agatelier piece is hand-finished — please allow 2–3 business days
        for processing.
      </p>

      <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/products">
          <Button size="lg">Continue Shopping</Button>
        </Link>
        <Link href="/">
          <Button size="lg" variant="outline">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
