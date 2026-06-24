"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MessageCircle, Package, Search, Settings, ShoppingBag, User, LogOut } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { SearchDialog } from "@/components/search-dialog";
import { Logo } from "@/components/logo";
import { useEffect, useRef, useState, type ReactNode } from "react";

const navLinks = [
  { href: "/products", label: "Shop" },
  { href: "/products?category=Lab%20Diamonds", label: "Diamonds" },
  { href: "/products?category=Lab%20Sapphires", label: "Color" },
  { href: "/about", label: "About" },
];

interface UserData {
  id: string;
  email: string;
  name: string;
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data?.user || null))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    const click = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", click);
    return () => document.removeEventListener("mousedown", click);
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setUserMenuOpen(false);
    router.push("/");
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <Logo />
            <span className="hidden font-serif text-xl font-bold tracking-tight text-foreground sm:inline">Avoryne</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const active = pathname === link.href || (link.href.startsWith("/products?") && pathname === "/products");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted ${
                    active ? "text-primary" : "text-foreground/70"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <IconBtn onClick={() => setSearchOpen(true)} aria-label="Search">
              <Search className="h-5 w-5" />
            </IconBtn>
            <IconLink href="/support" aria-label="Support">
              <MessageCircle className="h-5 w-5" />
            </IconLink>

            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="rounded-md p-2 text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="Account menu"
                >
                  <User className="h-5 w-5" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-md border bg-white py-2 shadow-lg">
                    <div className="border-b px-4 py-2">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <MenuLink href="/account" icon={<User className="h-4 w-4" />} label="My Account" onClick={() => setUserMenuOpen(false)} />
                    <MenuLink href="/account/orders" icon={<Package className="h-4 w-4" />} label="Orders" onClick={() => setUserMenuOpen(false)} />
                    <MenuLink href="/account/settings" icon={<Settings className="h-4 w-4" />} label="Settings" onClick={() => setUserMenuOpen(false)} />
                    <div className="mt-1 border-t pt-1">
                      <button
                        onClick={logout}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-muted-foreground hover:bg-muted"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <IconLink href="/auth/login" aria-label="Sign in">
                <User className="h-5 w-5" />
              </IconLink>
            )}

            <IconLink href="/cart" aria-label="Cart">
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 inline-flex min-w-[1.1rem] items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                  {totalItems}
                </span>
              )}
            </IconLink>
          </div>
        </div>
      </header>
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

function IconBtn({
  onClick,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="relative rounded-md p-2 text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
      {...props}
    >
      {children}
    </button>
  );
}

function IconLink({
  href,
  children,
  ...props
}: { href: string; children: ReactNode } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  return (
    <Link
      href={href}
      className="relative rounded-md p-2 text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
      {...props}
    >
      {children}
    </Link>
  );
}

function MenuLink({
  href,
  icon,
  label,
  onClick,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link href={href} onClick={onClick} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted">
      {icon}
      {label}
    </Link>
  );
}
