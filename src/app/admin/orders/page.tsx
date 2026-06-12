import { prisma } from "@/lib/prisma";
import { updateOrderStatus } from "./actions";
import StatusSelect from "./status-select";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  pending: "待处理",
  processing: "处理中",
  shipped: "已发货",
  delivered: "已送达",
  cancelled: "已取消",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: filterStatus } = await searchParams;

  const where = filterStatus ? { status: filterStatus } : {};
  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });

  const orderCounts = await prisma.order.groupBy({
    by: ["status"],
    _count: true,
  });

  return (
    <div>
      <h1 className="text-xl font-bold text-stone-800 mb-6">订单管理</h1>

      {/* Status filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <a
          href="/admin/orders"
          className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
            !filterStatus
              ? "bg-stone-800 text-white"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
        >
          全部 (
          {orderCounts.reduce((sum, c) => sum + c._count, 0)}
          )
        </a>
        {orderCounts.map(({ status, _count }) => (
          <a
            key={status}
            href={`/admin/orders?status=${status}`}
            className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
              filterStatus === status
                ? "bg-stone-800 text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            {STATUS_LABELS[status] || status} ({_count})
          </a>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
          <p className="text-stone-400">暂无订单</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl border border-stone-200 p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-stone-800">
                      {order.customerName}
                    </span>
                    <span className="text-xs text-stone-400">
                      {order.customerEmail}
                    </span>
                  </div>
                  <div className="text-xs text-stone-400 mt-1">
                    {new Date(order.createdAt).toLocaleString("zh-CN")} · ¥
                    {order.total.toFixed(2)}
                  </div>
                </div>
                <StatusSelect
                  orderId={order.id}
                  currentStatus={order.status}
                  updateAction={updateOrderStatus}
                />
              </div>

              {/* Order items */}
              <div className="border-t border-stone-100 pt-3">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-stone-400">
                      <th className="text-left pb-1 font-normal">商品</th>
                      <th className="text-right pb-1 font-normal">数量</th>
                      <th className="text-right pb-1 font-normal">单价</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-0.5 text-stone-700">
                          {item.product.name}
                        </td>
                        <td className="py-0.5 text-right text-stone-600">
                          {item.quantity}
                        </td>
                        <td className="py-0.5 text-right text-stone-600">
                          ¥{item.price.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Address */}
              <div className="mt-3 pt-3 border-t border-stone-100 text-xs text-stone-400">
                地址：{order.address}, {order.city}, {order.state}{" "}
                {order.zip}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
