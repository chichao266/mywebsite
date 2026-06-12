"use client";

import { useRouter } from "next/navigation";

const ROLE_OPTIONS = [
  { value: "user", label: "普通用户" },
  { value: "admin", label: "管理员" },
];

export default function RoleSelect({
  userId,
  currentRole,
  updateAction,
}: {
  userId: string;
  currentRole: string;
  updateAction: (userId: string, role: string) => Promise<void>;
}) {
  const router = useRouter();

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    await updateAction(userId, e.target.value);
    router.refresh();
  }

  return (
    <select
      value={currentRole}
      onChange={handleChange}
      className={`text-xs px-2 py-1 rounded-full border cursor-pointer ${
        currentRole === "admin"
          ? "bg-emerald-100 text-emerald-700 border-emerald-200"
          : "bg-stone-100 text-stone-600 border-stone-200"
      }`}
    >
      {ROLE_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
