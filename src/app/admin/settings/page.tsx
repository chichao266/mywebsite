import { getSettings, saveSetting } from "./actions";
import SettingsForm from "./settings-form";

export const dynamic = "force-dynamic";

const SYSTEM_SETTINGS = [
  { key: "system_site_name", title: "站点名称", placeholder: "Avoryne", desc: "浏览器标签页和页脚显示的名称" },
  { key: "system_site_desc", title: "站点描述", placeholder: "Lab-grown diamond and colored gemstone jewelry", desc: "SEO 描述，搜索引擎展示用" },
  { key: "system_contact_email", title: "联系邮箱", placeholder: "hello@avoryne.net", desc: "Contact Us 页面和邮件通知" },
  { key: "system_phone", title: "联系电话", placeholder: "+86 755-8888-8888", desc: "页脚和联系页面显示" },
  { key: "system_address", title: "公司地址", placeholder: "深圳市...", desc: "页脚显示" },
  { key: "system_currency", title: "货币符号", placeholder: "$", desc: "全站价格前缀" },
];

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  const settingsMap = new Map(settings.map((s) => [s.key, s]));

  return (
    <div>
      <h1 className="text-xl font-bold text-stone-800 mb-6">系统设置</h1>

      <SettingsForm
        settings={SYSTEM_SETTINGS}
        existing={settingsMap}
        saveAction={saveSetting}
      />
    </div>
  );
}
