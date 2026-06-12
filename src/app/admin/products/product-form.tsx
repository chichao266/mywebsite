"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct, type ProductFormData } from "./actions";

const defaultData: ProductFormData = {
  name: "",
  description: "",
  price: 0,
  category: "agate",
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
            价格 (¥)
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
          >            <option value="agate">Agate 玛瑙</option>
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
