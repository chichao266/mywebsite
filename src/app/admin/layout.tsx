import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "后台管理 - Avoryne",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="flex flex-col lg:flex-row">
        <aside className="hidden w-56 min-h-screen bg-white border-r border-stone-200 p-4 lg:flex flex-col">
          <div className="mb-8">
            <Link href="/" className="text-lg font-bold text-stone-800">
              Avoryne
            </Link>
            <p className="text-xs text-stone-400 mt-0.5">后台管理</p>
          </div>

          <nav className="flex flex-col gap-1 flex-1">
            <NavItem href="/admin" label="控制台" icon="📊" />
            <NavItem href="/admin/products" label="商品管理" icon="💎" />
            <NavItem href="/admin/orders" label="订单管理" icon="📦" />
            <NavItem href="/admin/customers" label="客户管理" icon="👥" />
            <NavItem href="/admin/tickets" label="客服工单" icon="🎫" />
            <NavItem href="/admin/content" label="内容管理" icon="📝" />
            <NavItem href="/admin/reports" label="数据报表" icon="📈" />
            <NavItem href="/admin/settings" label="系统设置" icon="⚙️" />
          </nav>

          <div className="pt-4 border-t border-stone-100">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-stone-400 hover:text-stone-600 transition-colors"
            >
              ← 返回前台
            </Link>
          </div>
        </aside>

        <div className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
          <div className="mb-3 flex items-center justify-between">
            <Link href="/admin" className="font-serif text-lg font-bold text-stone-800">
              Avoryne
            </Link>
            <Link href="/" className="text-xs text-stone-500">
              返回前台
            </Link>
          </div>
          <nav className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            <MobileNavItem href="/admin/orders" label="订单" />
            <MobileNavItem href="/admin/tickets" label="工单" />
            <MobileNavItem href="/admin/products" label="商品" />
            <MobileNavItem href="/admin/content" label="内容" />
            <MobileNavItem href="/admin/settings" label="设置" />
          </nav>
        </div>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

function NavItem({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors"
    >
      <span>{icon}</span>
      {label}
    </Link>
  );
}

function MobileNavItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="shrink-0 rounded-full bg-stone-100 px-4 py-2 text-sm font-medium text-stone-700"
    >
      {label}
    </Link>
  );
}
