import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-6">🎉</div>
      <h1 className="text-3xl font-bold">Order Confirmed!</h1>
      <p className="mt-4 text-muted-foreground max-w-md mx-auto">
        Thank you for your purchase. You will receive a confirmation email shortly.
      </p>
      <Link href="/products">
        <Button className="mt-8">Continue Shopping</Button>
      </Link>
    </div>
  );
}
