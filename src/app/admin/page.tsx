import { prisma } from "@/lib/prisma";
import { canUseDemoData } from "@/lib/admin-dev-fallbacks";
import { demoProducts } from "@/lib/demo-products";

export const dynamic = "force-dynamic";

function canUseDemoAdmin() {
  return canUseDemoData();
}

export default async function AdminDashboard() {
  let productCount = 0;
  let orderCount = 0;
  let userCount = 0;
  let ticketCount = 0;
  let recentOrders: Array<{ id: string; customerName: string; total: number; status: string; createdAt: Date }> = [];

  try {
    [productCount, orderCount, userCount, ticketCount] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.supportTicket.count({ where: { status: "open" } }),
    ]);

    recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    });
  } catch {
    if (!canUseDemoAdmin()) throw new Error("Database is required in production.");
    productCount = demoProducts.length;
  }

  const stats = [
    { label: "商品总数", value: productCount, icon: "💎" },
    { label: "订单总数", value: orderCount, icon: "📦" },
    { label: "用户总数", value: userCount, icon: "👤" },
    { label: "待处理工单", value: ticketCount, icon: "🎫" },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold text-stone-800 mb-6">控制台</h1>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border border-stone-200 p-4"
          >
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-bold text-stone-800">{s.value}</div>
            <div className="text-sm text-stone-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl border border-stone-200 p-4">
        <h2 className="text-sm font-semibold text-stone-700 mb-3">最近订单</h2>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-stone-400">暂无订单</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-stone-500 border-b border-stone-100">
                <th className="pb-2 font-medium">客户</th>
                <th className="pb-2 font-medium">金额</th>
                <th className="pb-2 font-medium">状态</th>
                <th className="pb-2 font-medium">时间</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-stone-50">
                  <td className="py-2 text-stone-700">{order.customerName}</td>
                  <td className="py-2 text-stone-700">${order.total.toFixed(2)}</td>
                  <td className="py-2">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="py-2 text-stone-400">
                    {new Date(order.createdAt).toLocaleDateString("zh-CN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };
  const labels: Record<string, string> = {
    pending: "待处理",
    processing: "处理中",
    shipped: "已发货",
    delivered: "已送达",
    cancelled: "已取消",
  };

  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[status] || "bg-stone-100 text-stone-600"}`}
    >
      {labels[status] || status}
    </span>
  );
}
