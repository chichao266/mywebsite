import Link from "next/link";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-4 py-14 sm:px-6 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 font-serif text-xl font-bold text-foreground">
              <Logo size={22} />
              Lumea
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
              Modern lab-grown diamond and colored gemstone jewelry for everyday brilliance.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Shop</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li><Link href="/products" className="hover:text-foreground">All Jewelry</Link></li>
              <li><Link href="/products?category=Lab%20Diamonds" className="hover:text-foreground">Lab Diamonds</Link></li>
              <li><Link href="/products?category=Lab%20Sapphires" className="hover:text-foreground">Colored Gemstones</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Company</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground">Our Standards</Link></li>
              <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
              <li><Link href="/support" className="hover:text-foreground">Support</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Care</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li><Link href="/shipping" className="hover:text-foreground">Shipping & Delivery</Link></li>
              <li><Link href="/returns" className="hover:text-foreground">Returns & Exchanges</Link></li>
              <li><Link href="/contact#faq" className="hover:text-foreground">FAQ</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Lumea. All rights reserved.</p>
          <p className="max-w-xl text-xs">
            Lab-grown gemstones are disclosed clearly on each product page. Product photography may vary by screen.
          </p>
        </div>
      </div>
    </footer>
  );
}
