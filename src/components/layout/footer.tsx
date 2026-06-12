import Link from "next/link";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 sm:px-6 py-14 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 text-xl font-serif font-bold text-foreground">
              <Logo size={22} />
              Agatelier
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs">
              Handcrafted agate jewelry. Each stone carries a melody millions of years in the making.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-primary tracking-wider uppercase">Shop</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li><Link href="/products" className="hover:text-foreground transition-colors">Collection</Link></li>
              <li><Link href="/cart" className="hover:text-foreground transition-colors">Shopping Cart</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-primary tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition-colors">Our Story</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-primary tracking-wider uppercase">Care</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li><Link href="/shipping" className="hover:text-foreground transition-colors">Shipping & Delivery</Link></li>
              <li><Link href="/returns" className="hover:text-foreground transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/contact#faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Agatelier. All rights reserved.</p>
          <p className="text-xs">Natural stone jewelry. Patterned pieces are one of a kind; solid colors are consistent. Colors and patterns may vary.</p>
        </div>
      </div>
    </footer>
  );
}
