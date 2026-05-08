export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold">My Store</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your one-stop shop for quality products.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Links</h3>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              <li><a href="/products" className="hover:text-foreground transition-colors">All Products</a></li>
              <li><a href="/cart" className="hover:text-foreground transition-colors">Shopping Cart</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Policies</h3>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Return Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} My Store. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
