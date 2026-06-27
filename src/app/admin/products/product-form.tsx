"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct, type ProductFormData } from "./actions";

const maxImages = 5;

const defaultData: ProductFormData = {
  name: "",
  description: "",
  price: 0,
  category: "Lab Diamonds",
  productType: "Ring",
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
  const [uploading, setUploading] = useState<number | null>(null);
  const [error, setError] = useState("");

  function getImages() {
    try {
      const images = JSON.parse(data.images);
      return Array.isArray(images) ? images.filter((url) => typeof url === "string") : [];
    } catch {
      return [];
    }
  }

  function update(field: keyof ProductFormData, value: string | number | boolean) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  function updateImages(images: string[]) {
    update("images", JSON.stringify(images));
  }

  async function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError("");
    setUploading(index ?? -1);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "图片上传失败");
      }

      const images = getImages();
      if (index !== undefined && index < images.length) {
        images[index] = json.url;
      } else {
        images.push(json.url);
      }
      updateImages(images);
    } catch (err) {
      setError(err instanceof Error ? err.message : "图片上传失败");
    } finally {
      setUploading(null);
    }
  }

  function removeImage(index: number) {
    updateImages(getImages().filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    if (isEdit) {
      await updateProduct(productId!, data);
    } else {
      await createProduct(data);
    }
  }

  const images = getImages();

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

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
        <TextField label="Metal" value={data.metal || ""} onChange={(value) => update("metal", value)} placeholder="925 Sterling Silver" />
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
            商品类型
          </label>
          <select
            value={data.productType || "Ring"}
            onChange={(e) => update("productType", e.target.value)}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="Ring">Ring 戒指</option>
            <option value="Necklace">Necklace 项链</option>
            <option value="Earrings">Earrings 耳环</option>
            <option value="Bracelet">Bracelet 手链</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            宝石分类
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
            <option value="Other Gemstones">Other Gemstones 其他宝石</option>
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

        <div className="col-span-2">
          <label className="block text-sm font-medium text-stone-700 mb-2">
            商品图片 ({images.length}/{maxImages})
          </label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {images.map((url, index) => (
              <div key={`${url}-${index}`} className="relative group aspect-square rounded-lg border border-stone-200 bg-stone-50 overflow-hidden">
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs text-white opacity-90 hover:bg-red-700"
                  aria-label="删除图片"
                >
                  ×
                </button>
                <label className="absolute inset-x-0 bottom-0 cursor-pointer bg-black/60 px-2 py-1 text-center text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {uploading === index ? "上传中..." : "替换"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => handleImageUpload(e, index)}
                    className="hidden"
                  />
                </label>
              </div>
            ))}

            {images.length < maxImages && (
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-stone-300 bg-stone-50 text-sm text-stone-500 transition-colors hover:border-emerald-500 hover:text-emerald-700">
                <span className="text-xl">+</span>
                <span>{uploading === -1 ? "上传中..." : "上传图片"}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => handleImageUpload(e)}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <p className="mt-2 text-xs text-stone-500">
            支持 JPG、PNG、WebP，单张不超过 5MB。建议商品主图使用正方形或接近正方形。
          </p>
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
