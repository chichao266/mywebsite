import { getTickets, updateTicketStatus } from "./actions";
import TicketStatusSelect from "./ticket-status";

export const dynamic = "force-dynamic";
const TICKETS_PER_PAGE = 20;

export default async function AdminTicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const { status: filterStatus, page } = await searchParams;
  const requestedPage = Number.parseInt(page || "1", 10);
  const ticketPage = await getTickets(
    filterStatus,
    Number.isFinite(requestedPage) ? requestedPage : 1,
    TICKETS_PER_PAGE
  );
  const { tickets, totalCount, totalPages } = ticketPage;

  function pageHref(nextPage: number) {
    const params = new URLSearchParams();
    if (filterStatus) params.set("status", filterStatus);
    if (nextPage > 1) params.set("page", String(nextPage));
    const query = params.toString();
    return query ? `/admin/tickets?${query}` : "/admin/tickets";
  }

  return (
    <div>
      <h1 className="mb-5 text-xl font-bold text-stone-800 sm:mb-6">客服工单</h1>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {[
          { key: "", label: "活跃" },
          { key: "open", label: "待处理" },
          { key: "in_progress", label: "处理中" },
          { key: "resolved", label: "已解决" },
          { key: "closed", label: "已关闭" },
        ].map((tab) => (
          <a
            key={tab.key}
            href={tab.key ? `/admin/tickets?status=${tab.key}` : "/admin/tickets"}
            className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
              (filterStatus || "") === tab.key
                ? "bg-stone-800 text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      {totalCount > 0 && (
        <p className="mb-4 text-xs text-stone-400">
          第 {ticketPage.page} / {totalPages} 页，共 {totalCount} 个工单
        </p>
      )}

      {tickets.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
          <p className="text-stone-400">暂无工单</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="bg-white rounded-xl border border-stone-200 p-4">
              <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h3 className="break-words text-sm font-medium text-stone-800">
                    {ticket.subject}
                  </h3>
                  <div className="mt-1 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                    <span className="break-all text-xs text-stone-500">
                      {ticket.name} ({ticket.email})
                    </span>
                    <span className="hidden text-xs text-stone-300 sm:inline">·</span>
                    <span className="text-xs text-stone-400">
                      {new Date(ticket.createdAt).toLocaleString("zh-CN")}
                    </span>
                  </div>
                </div>
                <div className="shrink-0">
                  <TicketStatusSelect
                    ticketId={ticket.id}
                    currentStatus={ticket.status}
                    updateAction={updateTicketStatus}
                  />
                </div>
              </div>
              <p className="mt-2 whitespace-pre-wrap break-words rounded-lg bg-stone-50 p-3 text-sm leading-6 text-stone-600">
                {ticket.message}
              </p>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="mt-6 flex items-center justify-center gap-3" aria-label="工单分页">
          <a
            href={pageHref(Math.max(1, ticketPage.page - 1))}
            aria-disabled={ticketPage.page <= 1}
            className={`rounded-full border px-4 py-2 text-xs transition-colors ${
              ticketPage.page <= 1
                ? "pointer-events-none border-stone-200 text-stone-300"
                : "border-stone-200 bg-white text-stone-700 hover:border-stone-400"
            }`}
          >
            上一页
          </a>
          <span className="min-w-20 text-center text-xs text-stone-400">
            {ticketPage.page} / {totalPages}
          </span>
          <a
            href={pageHref(Math.min(totalPages, ticketPage.page + 1))}
            aria-disabled={ticketPage.page >= totalPages}
            className={`rounded-full border px-4 py-2 text-xs transition-colors ${
              ticketPage.page >= totalPages
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
