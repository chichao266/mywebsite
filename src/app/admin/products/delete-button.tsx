"use client";

import { deleteProduct } from "./actions";
import { useRouter } from "next/navigation";

export default function DeleteButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`确定要删除「${name}」吗？`)) return;
    await deleteProduct(id);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className="text-red-500 hover:text-red-700 text-xs"
    >
      删除
    </button>
  );
}
