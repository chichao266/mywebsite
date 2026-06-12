import { getTickets, updateTicketStatus } from "./actions";
import TicketStatusSelect from "./ticket-status";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  open: "待处理",
  in_progress: "处理中",
  resolved: "已解决",
  closed: "已关闭",
};

const STATUS_COLORS: Record<string, string> = {
  open: "bg-red-100 text-red-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  resolved: "bg-green-100 text-green-700",
  closed: "bg-stone-100 text-stone-500",
};

export default async function AdminTicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: filterStatus } = await searchParams;
  const tickets = await getTickets(filterStatus);

  return (
    <div>
      <h1 className="text-xl font-bold text-stone-800 mb-6">客服工单</h1>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {[
          { key: "", label: "全部" },
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

      {tickets.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
          <p className="text-stone-400">暂无工单</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white rounded-xl border border-stone-200 p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-sm font-medium text-stone-800">
                    {ticket.subject}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-stone-500">
                      {ticket.name} ({ticket.email})
                    </span>
                    <span className="text-xs text-stone-300">·</span>
                    <span className="text-xs text-stone-400">
                      {new Date(ticket.createdAt).toLocaleString("zh-CN")}
                    </span>
                  </div>
                </div>
                <TicketStatusSelect
                  ticketId={ticket.id}
                  currentStatus={ticket.status}
                  updateAction={updateTicketStatus}
                />
              </div>
              <p className="text-sm text-stone-600 bg-stone-50 rounded-lg p-3 mt-2">
                {ticket.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
