"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, MessageCircle, User, ShoppingBag, LogOut, Package, Settings } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { SearchDialog } from "@/components/search-dialog";
import { Logo } from "@/components/logo";
import { useState, useEffect, useRef, type ReactNode } from "react";

const navLinks = [
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

interface UserData { id: string; email: string; name: string; }

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
    setUser(null); setUserMenuOpen(false); router.push("/");
  };

  const D = "#2d2d2d", H = "#000", G = "#1a7a5a";

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Logo />
            <span className="hidden sm:inline font-serif text-xl font-bold" style={{ color: H }}>Agatelier</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => {
              const act = pathname === l.href;
              return (
                <Link key={l.href} href={l.href}
                  className="px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-muted"
                  style={{ color: act ? G : D }}
                  onMouseEnter={e => { if (!act) e.currentTarget.style.color = H; }}
                  onMouseLeave={e => { if (!act) e.currentTarget.style.color = D; }}
                >{l.label}</Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <IconBtn onClick={() => setSearchOpen(true)} aria-label="Search"><Search className="w-5 h-5" /></IconBtn>
            <IconLink href="/support" aria-label="Support"><MessageCircle className="w-5 h-5" /></IconLink>

            {user ? (
              <div className="relative" ref={menuRef}>
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="p-2 rounded-md hover:bg-primary/8 transition-colors" style={{ color: G }}><User className="w-5 h-5" /></button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b"><p className="text-sm font-medium">{user.name}</p><p className="text-xs text-gray-500">{user.email}</p></div>
                    <MenuLink href="/account" icon={<User className="w-4 h-4" />} label="My Account" onClick={() => setUserMenuOpen(false)} />
                    <MenuLink href="/account/orders" icon={<Package className="w-4 h-4" />} label="Orders" onClick={() => setUserMenuOpen(false)} />
                    <MenuLink href="/account/settings" icon={<Settings className="w-4 h-4" />} label="Settings" onClick={() => setUserMenuOpen(false)} />
                    <div className="border-t mt-1 pt-1"><button onClick={logout} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-500 hover:bg-gray-50 w-full text-left"><LogOut className="w-4 h-4" />Sign out</button></div>
                  </div>
                )}
              </div>
            ) : (
              <IconLink href="/auth/login" aria-label="Sign in"><User className="w-5 h-5" /></IconLink>
            )}

            <IconLink href="/cart" aria-label="Cart">
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-white min-w-[1.1rem]">{totalItems}</span>}
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
  ...p
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return <button onClick={onClick} className="p-2 rounded-md hover:bg-muted transition-colors relative" style={{ color: "#2d2d2d" }} onMouseEnter={e => e.currentTarget.style.color = "#000"} onMouseLeave={e => e.currentTarget.style.color = "#2d2d2d"} {...p}>{children}</button>;
}

function IconLink({
  href,
  children,
  ...p
}: { href: string; children: ReactNode } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  return <Link href={href} className="p-2 rounded-md hover:bg-muted transition-colors relative" style={{ color: "#2d2d2d" }} onMouseEnter={e => e.currentTarget.style.color = "#000"} onMouseLeave={e => e.currentTarget.style.color = "#2d2d2d"} {...p}>{children}</Link>;
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
  return <Link href={href} onClick={onClick} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50" style={{ color: "#2d2d2d" }}>{icon}{label}</Link>;
}
