"use client";

import { useRouter } from "next/navigation";

const OPTIONS = [
  { value: "open", label: "待处理" },
  { value: "in_progress", label: "处理中" },
  { value: "resolved", label: "已解决" },
  { value: "closed", label: "已关闭" },
];

const COLORS: Record<string, string> = {
  open: "bg-red-100 text-red-700 border-red-200",
  in_progress: "bg-yellow-100 text-yellow-700 border-yellow-200",
  resolved: "bg-green-100 text-green-700 border-green-200",
  closed: "bg-stone-100 text-stone-500 border-stone-200",
};

export default function TicketStatusSelect({
  ticketId,
  currentStatus,
  updateAction,
}: {
  ticketId: string;
  currentStatus: string;
  updateAction: (ticketId: string, status: string) => Promise<void>;
}) {
  const router = useRouter();

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    await updateAction(ticketId, e.target.value);
    router.refresh();
  }

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      className={`min-h-9 rounded-full border px-3 py-1.5 text-xs font-medium cursor-pointer ${COLORS[currentStatus] || "bg-stone-100"}`}
    >
      {OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
