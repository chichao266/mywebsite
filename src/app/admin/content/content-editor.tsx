"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ContentEditor({
  settingKey,
  title,
  initialContent,
  saveAction,
  deleteAction,
  hasContent,
}: {
  settingKey: string;
  title: string;
  initialContent: string;
  saveAction: (key: string, title: string, content: string) => Promise<void>;
  deleteAction: (key: string) => Promise<void>;
  hasContent: boolean;
}) {
  const router = useRouter();
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  async function handleSave() {
    setSaving(true);
    await saveAction(settingKey, title, content);
    setSaving(false);
    setEditing(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("确定要清除这段内容吗？")) return;
    await deleteAction(settingKey);
    setContent("");
    router.refresh();
  }

  if (!editing && hasContent) {
    return (
      <div>
        <p className="text-sm text-stone-600 line-clamp-2 mb-3">
          {initialContent.slice(0, 100)}
          {initialContent.length > 100 ? "..." : ""}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-emerald-600 hover:text-emerald-800"
          >
            编辑
          </button>
          <button
            onClick={handleDelete}
            className="text-xs text-red-400 hover:text-red-600"
          >
            清除
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <textarea
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-2"
        placeholder={`输入${title}内容...`}
      />
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-1.5 bg-emerald-600 text-white text-xs rounded-lg hover:bg-emerald-700 disabled:opacity-50"
        >
          {saving ? "保存中..." : "保存"}
        </button>
        <button
          onClick={() => {
            setContent(initialContent);
            setEditing(false);
          }}
          className="px-4 py-1.5 border border-stone-300 text-stone-600 text-xs rounded-lg hover:bg-stone-50"
        >
          取消
        </button>
      </div>
    </div>
  );
}
