"use client";

import { useRouter } from "next/navigation";

const STATUS_OPTIONS = [
  { value: "pending_payment", label: "等待付款" },
  { value: "pending", label: "待处理" },
  { value: "processing", label: "处理中" },
  { value: "shipped", label: "已发货" },
  { value: "delivered", label: "已送达" },
  { value: "cancelled", label: "已取消" },
];

const STATUS_COLORS: Record<string, string> = {
  pending_payment: "bg-amber-100 text-amber-700 border-amber-200",
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  processing: "bg-blue-100 text-blue-700 border-blue-200",
  shipped: "bg-purple-100 text-purple-700 border-purple-200",
  delivered: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

export default function StatusSelect({
  orderId,
  currentStatus,
  updateAction,
}: {
  orderId: string;
  currentStatus: string;
  updateAction: (orderId: string, status: string) => Promise<void>;
}) {
  const router = useRouter();

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value;
    await updateAction(orderId, newStatus);
    router.refresh();
  }

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      className={`min-h-9 rounded-full border px-3 py-1.5 text-xs font-medium cursor-pointer ${STATUS_COLORS[currentStatus] || "bg-stone-100 text-stone-600 border-stone-200"}`}
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
