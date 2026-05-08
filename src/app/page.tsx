import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-28 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Welcome to My Store
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our curated collection of quality products. 
            Shop with confidence and enjoy fast shipping.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="text-base">
                Shop Now
              </Button>
            </Link>
            <Link href="/products">
              <Button size="lg" variant="outline" className="text-base">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center p-6">
              <div className="text-3xl mb-4">🚀</div>
              <h3 className="text-lg font-semibold">Fast Shipping</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Free shipping on orders over $50. Delivery within 3-5 business days.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-3xl mb-4">🔒</div>
              <h3 className="text-lg font-semibold">Secure Checkout</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Your payment information is always protected with industry-standard encryption.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-3xl mb-4">💬</div>
              <h3 className="text-lg font-semibold">24/7 Support</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Our team is here to help you with any questions or concerns.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
