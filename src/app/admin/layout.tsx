import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "后台管理 - Lumea",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="flex">
        <aside className="w-56 min-h-screen bg-white border-r border-stone-200 p-4 flex flex-col">
          <div className="mb-8">
            <Link href="/" className="text-lg font-bold text-stone-800">
              Lumea
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

        <main className="flex-1 p-6">{children}</main>
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
