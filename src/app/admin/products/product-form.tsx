"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct, type ProductFormData } from "./actions";

const defaultData: ProductFormData = {
  name: "",
  description: "",
  price: 0,
  category: "Lab Diamonds",
  stoneType: "Lab-grown diamond",
  metal: "",
  caratWeight: "",
  cut: "",
  color: "",
  clarity: "",
  certification: "",
  dimensions: "",
  care: "",
  stock: 0,
  featured: false,
  images: "[]",
};

export default function ProductForm({
  initialData,
  productId,
}: {
  initialData?: ProductFormData;
  productId?: string;
}) {
  const router = useRouter();
  const isEdit = !!productId;
  const [data, setData] = useState<ProductFormData>(
    initialData || defaultData
  );
  const [saving, setSaving] = useState(false);

  function update(field: keyof ProductFormData, value: string | number | boolean) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    if (isEdit) {
      await updateProduct(productId!, data);
    } else {
      await createProduct(data);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <div className="grid grid-cols-2 gap-4">
        {/* Name */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-stone-700 mb-1">
            商品名称
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => update("name", e.target.value)}
            required
            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="col-span-2 border-t border-stone-100 pt-4">
          <h2 className="text-sm font-semibold text-stone-800">珠宝规格</h2>
          <p className="mt-1 text-xs text-stone-500">这些信息会显示在商品详情页，建议用英文填写。</p>
        </div>

        <TextField label="Stone Type" value={data.stoneType || ""} onChange={(value) => update("stoneType", value)} placeholder="Lab-grown diamond" />
        <TextField label="Metal" value={data.metal || ""} onChange={(value) => update("metal", value)} placeholder="14k gold vermeil" />
        <TextField label="Carat Weight" value={data.caratWeight || ""} onChange={(value) => update("caratWeight", value)} placeholder="0.50 ct total" />
        <TextField label="Cut" value={data.cut || ""} onChange={(value) => update("cut", value)} placeholder="Round brilliant" />
        <TextField label="Color" value={data.color || ""} onChange={(value) => update("color", value)} placeholder="Near-colorless" />
        <TextField label="Clarity" value={data.clarity || ""} onChange={(value) => update("clarity", value)} placeholder="VS equivalent" />
        <TextField label="Certification" value={data.certification || ""} onChange={(value) => update("certification", value)} placeholder="Certificate available" />
        <TextField label="Dimensions" value={data.dimensions || ""} onChange={(value) => update("dimensions", value)} placeholder="6 mm setting" />

        <div className="col-span-2">
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Care
          </label>
          <textarea
            rows={3}
            value={data.care || ""}
            onChange={(e) => update("care", e.target.value)}
            placeholder="Clean with a soft cloth and store separately."
            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Description */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-stone-700 mb-1">
            描述
          </label>
          <textarea
            rows={3}
            value={data.description}
            onChange={(e) => update("description", e.target.value)}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            价格 ($)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={data.price}
            onChange={(e) => update("price", parseFloat(e.target.value) || 0)}
            required
            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            库存
          </label>
          <input
            type="number"
            min="0"
            value={data.stock}
            onChange={(e) => update("stock", parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            分类
          </label>
          <select
            value={data.category}
            onChange={(e) => update("category", e.target.value)}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="Lab Diamonds">Lab Diamonds 培育钻石</option>
            <option value="Lab Sapphires">Lab Sapphires 培育蓝宝石</option>
            <option value="Lab Emeralds">Lab Emeralds 培育祖母绿</option>
            <option value="Lab Rubies">Lab Rubies 培育红宝石</option>
          </select>
        </div>

        {/* Featured */}
        <div className="flex items-center gap-2 pt-6">
          <input
            type="checkbox"
            id="featured"
            checked={data.featured}
            onChange={(e) => update("featured", e.target.checked)}
            className="w-4 h-4 text-emerald-600 border-stone-300 rounded focus:ring-emerald-500"
          />
          <label htmlFor="featured" className="text-sm text-stone-700">
            首页推荐
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
        >
          {saving ? "保存中..." : isEdit ? "更新商品" : "创建商品"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-stone-300 text-stone-600 text-sm rounded-lg hover:bg-stone-50 transition-colors"
        >
          取消
        </button>
      </div>
    </form>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-1">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
    </div>
  );
}
