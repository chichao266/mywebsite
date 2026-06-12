"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SettingDef = {
  key: string;
  title: string;
  placeholder: string;
  desc: string;
};

export default function SettingsForm({
  settings,
  existing,
  saveAction,
}: {
  settings: SettingDef[];
  existing: Map<string, { title: string; content: string }>;
  saveAction: (key: string, title: string, content: string) => Promise<void>;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState<string | null>(null);

  async function handleSave(def: SettingDef, content: string) {
    setSaving(def.key);
    await saveAction(def.key, def.title, content);
    setSaving(null);
    router.refresh();
  }

  return (
    <div className="max-w-xl space-y-4">
      {settings.map((def) => (
        <SettingField
          key={def.key}
          def={def}
          initialValue={existing.get(def.key)?.content || ""}
          saving={saving === def.key}
          onSave={handleSave}
        />
      ))}
    </div>
  );
}

function SettingField({
  def,
  initialValue,
  saving,
  onSave,
}: {
  def: SettingDef;
  initialValue: string;
  saving: boolean;
  onSave: (def: SettingDef, content: string) => Promise<void>;
}) {
  const [value, setValue] = useState(initialValue);

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-4">
      <label className="block text-sm font-medium text-stone-700 mb-1">
        {def.title}
      </label>
      <p className="text-xs text-stone-400 mb-2">{def.desc}</p>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={def.placeholder}
          className="flex-1 px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          onClick={() => onSave(def, value)}
          disabled={saving}
          className="px-4 py-2 bg-emerald-600 text-white text-xs rounded-lg hover:bg-emerald-700 disabled:opacity-50 whitespace-nowrap"
        >
          {saving ? "保存中" : "保存"}
        </button>
      </div>
    </div>
  );
}
