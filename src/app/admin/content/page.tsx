import { getSiteSettings, saveSiteSetting, deleteSiteSetting } from "./actions";
import ContentEditor from "./content-editor";

export const dynamic = "force-dynamic";

const PRESET_KEYS = [
  { key: "brand_intro", title: "品牌简介", desc: "首页 Footer 品牌介绍文字" },
  { key: "our_story", title: "品牌故事", desc: "Our Story 页面内容" },
  { key: "contact_us", title: "联系我们", desc: "Contact Us 页面内容" },
  { key: "shipping", title: "配送说明", desc: "Shipping & Delivery 页面" },
  { key: "returns", title: "退换政策", desc: "Returns & Exchanges 页面" },
  { key: "faq", title: "常见问题", desc: "FAQ 问答内容" },
];

export default async function AdminContentPage() {
  const settings = await getSiteSettings();
  const settingsMap = new Map(settings.map((s) => [s.key, s]));

  return (
    <div>
      <h1 className="text-xl font-bold text-stone-800 mb-6">内容管理</h1>

      <div className="space-y-4 max-w-2xl">
        {PRESET_KEYS.map((preset) => {
          const existing = settingsMap.get(preset.key);
          return (
            <div
              key={preset.key}
              className="bg-white rounded-xl border border-stone-200 p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-stone-700">
                    {preset.title}
                  </h3>
                  <p className="text-xs text-stone-400">{preset.desc}</p>
                </div>
                {existing ? (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    已设置
                  </span>
                ) : (
                  <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">
                    未设置
                  </span>
                )}
              </div>
              <ContentEditor
                settingKey={preset.key}
                title={preset.title}
                initialContent={existing?.content || ""}
                saveAction={saveSiteSetting}
                deleteAction={deleteSiteSetting}
                hasContent={!!existing}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
