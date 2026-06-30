import { prisma } from "@/lib/prisma";
import { rethrowInProduction } from "@/lib/admin-dev-fallbacks";
import { getPaymentLabel } from "@/lib/payment-config";
import { updateOrderStatus } from "./actions";
import StatusSelect from "./status-select";

export const dynamic = "force-dynamic";
const ORDERS_PER_PAGE = 20;

const STATUS_LABELS: Record<string, string> = {
  pending_payment: "等待付款",
  pending: "待处理",
  processing: "处理中",
  shipped: "已发货",
  delivered: "已送达",
  cancelled: "已取消",
};

async function getOrders(where: { status?: string }, page: number) {
  return prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * ORDERS_PER_PAGE,
    take: ORDERS_PER_PAGE,
    include: { items: { include: { product: true } } },
  });
}

async function getOrderTotal(where: { status?: string }) {
  return prisma.order.count({ where });
}

async function getOrderCounts() {
  return prisma.order.groupBy({
    by: ["status"],
    _count: true,
  });
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const { status: filterStatus, page } = await searchParams;
  const requestedPage = Number.parseInt(page || "1", 10);
  const currentPage = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const where = filterStatus ? { status: filterStatus } : {};
  let orders: Awaited<ReturnType<typeof getOrders>> = [];
  let orderCounts: Awaited<ReturnType<typeof getOrderCounts>> = [];
  let totalOrders = 0;
  let totalPages = 1;
  let activePage = currentPage;

  try {
    [orderCounts, totalOrders] = await Promise.all([
      getOrderCounts(),
      getOrderTotal(where),
    ]);
    totalPages = Math.max(1, Math.ceil(totalOrders / ORDERS_PER_PAGE));
    activePage = Math.min(currentPage, totalPages);
    orders = await getOrders(where, activePage);
  } catch (error) {
    rethrowInProduction(error);
  }

  function pageHref(nextPage: number) {
    const params = new URLSearchParams();
    if (filterStatus) params.set("status", filterStatus);
    if (nextPage > 1) params.set("page", String(nextPage));
    const query = params.toString();
    return query ? `/admin/orders?${query}` : "/admin/orders";
  }

  return (
    <div>
      <h1 className="mb-5 text-xl font-bold text-stone-800 sm:mb-6">订单管理</h1>

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

      {totalOrders > 0 && (
        <p className="mb-4 text-xs text-stone-400">
          第 {activePage} / {totalPages} 页，共 {totalOrders} 个订单
        </p>
      )}

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
          <p className="text-stone-400">暂无订单</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl border border-stone-200 p-4">
              <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                    <span className="text-sm font-medium text-stone-800 break-words">
                      {order.customerName}
                    </span>
                    <span className="break-all text-xs text-stone-400">
                      {order.customerEmail}
                    </span>
                  </div>
                  <div className="text-xs text-stone-400 mt-1">
                    {new Date(order.createdAt).toLocaleString("zh-CN")} · $
                    {order.total.toFixed(2)}
                    {" · "}
                    {getPaymentLabel(order.paymentMethod)}
                  </div>
                </div>
                <div className="shrink-0">
                  <StatusSelect
                    orderId={order.id}
                    currentStatus={order.status}
                    updateAction={updateOrderStatus}
                  />
                </div>
              </div>

              {/* Order items */}
              <div className="border-t border-stone-100 pt-3">
                <table className="w-full table-fixed text-xs">
                  <thead>
                    <tr className="text-stone-400">
                      <th className="pb-1 text-left font-normal">商品</th>
                      <th className="w-12 pb-1 text-right font-normal">数量</th>
                      <th className="w-20 pb-1 text-right font-normal">单价</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-0.5 pr-2 text-stone-700 break-words">
                          {item.product.name}
                        </td>
                        <td className="py-0.5 text-right text-stone-600">
                          {item.quantity}
                        </td>
                        <td className="py-0.5 text-right text-stone-600">
                          ${item.price.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Address */}
              <div className="mt-3 border-t border-stone-100 pt-3 text-xs leading-5 text-stone-400 break-words">
                地址：{order.address}, {order.city}, {order.state}{" "}
                {order.zip}
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="mt-6 flex items-center justify-center gap-3" aria-label="订单分页">
          <a
            href={pageHref(Math.max(1, activePage - 1))}
            aria-disabled={activePage <= 1}
            className={`rounded-full border px-4 py-2 text-xs transition-colors ${
              activePage <= 1
                ? "pointer-events-none border-stone-200 text-stone-300"
                : "border-stone-200 bg-white text-stone-700 hover:border-stone-400"
            }`}
          >
            上一页
          </a>
          <span className="min-w-20 text-center text-xs text-stone-400">
            {activePage} / {totalPages}
          </span>
          <a
            href={pageHref(Math.min(totalPages, activePage + 1))}
            aria-disabled={activePage >= totalPages}
            className={`rounded-full border px-4 py-2 text-xs transition-colors ${
              activePage >= totalPages
                ? "pointer-events-none border-stone-200 text-stone-300"
                : "border-stone-200 bg-white text-stone-700 hover:border-stone-400"
            }`}
          >
            下一页
          </a>
        </nav>
      )}
    </div>
  );
}
