import { getStats } from "./actions";
import BarChart from "./bar-chart";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  pending: "待处理",
  processing: "处理中",
  shipped: "已发货",
  delivered: "已送达",
  cancelled: "已取消",
};

const CATEGORY_LABELS: Record<string, string> = {  agate: "玛瑙",
};

export default async function AdminReportsPage() {
  const stats = await getStats();

  const maxOrderCount = Math.max(
    ...stats.ordersByStatus.map((s) => s._count),
    1
  );
  const maxProductCount = Math.max(
    ...stats.productsByCategory.map((s) => s._count),
    1
  );

  return (
    <div>
      <h1 className="text-xl font-bold text-stone-800 mb-6">数据报表</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "商品总数", value: stats.totalProducts, color: "text-emerald-600" },
          { label: "订单总数", value: stats.totalOrders, color: "text-blue-600" },
          { label: "用户总数", value: stats.totalUsers, color: "text-purple-600" },
          {
            label: "总营收",
            value: `¥${stats.totalRevenue.toFixed(2)}`,
            color: "text-amber-600",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-stone-200 p-4"
          >
            <div className={`text-2xl font-bold ${card.color}`}>
              {card.value}
            </div>
            <div className="text-sm text-stone-500 mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Orders by status */}
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <h2 className="text-sm font-semibold text-stone-700 mb-4">
            订单状态分布
          </h2>
          <BarChart
            data={stats.ordersByStatus.map((s) => ({
              label: STATUS_LABELS[s.status] || s.status,
              value: s._count,
            }))}
            max={maxOrderCount}
            color="bg-blue-500"
          />
        </div>

        {/* Products by category */}
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <h2 className="text-sm font-semibold text-stone-700 mb-4">
            商品分类分布
          </h2>
          <BarChart
            data={stats.productsByCategory.map((s) => ({
              label: CATEGORY_LABELS[s.category] || s.category,
              value: s._count,
            }))}
            max={maxProductCount}
            color="bg-emerald-500"
          />
        </div>
      </div>

      {/* Revenue trend (simple list) */}
      <div className="bg-white rounded-xl border border-stone-200 p-4">
        <h2 className="text-sm font-semibold text-stone-700 mb-4">
          最近 10 笔订单
        </h2>
        {stats.recentOrders.length === 0 ? (
          <p className="text-sm text-stone-400">暂无订单</p>
        ) : (
          <div className="flex items-end gap-1 h-32">
            {stats.recentOrders.reverse().map((order, i) => {
              const maxTotal = Math.max(
                ...stats.recentOrders.map((o) => o.total),
                1
              );
              const height = (order.total / maxTotal) * 100;
              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-1"
                  title={`¥${order.total.toFixed(2)} - ${new Date(order.createdAt).toLocaleDateString("zh-CN")}`}
                >
                  <span className="text-xs text-stone-400">
                    ¥{order.total.toFixed(0)}
                  </span>
                  <div
                    className="w-full bg-emerald-400 rounded-t"
                    style={{ height: `${Math.max(height, 4)}%` }}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
