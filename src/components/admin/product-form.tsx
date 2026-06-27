"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  images: string[];
  category: string;
  productType?: string;
  stoneType?: string;
  metal?: string;
  caratWeight?: string;
  cut?: string;
  color?: string;
  clarity?: string;
  certification?: string;
  dimensions?: string;
  care?: string;
  stock: string;
  featured: boolean;
}

interface Props {
  initial?: ProductFormData;
  productId?: string;
  isEdit?: boolean;
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function ProductForm({ initial, productId, isEdit }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormData>(
    initial || {
      name: "",
      description: "",
      price: "",
      images: [],
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
      stock: "1",
      featured: false,
    }
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<number | null>(null);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(index ?? -1);
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: data });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      setForm((prev) => {
        const images = [...prev.images];
        if (index !== undefined && index < images.length) images[index] = json.url;
        else images.push(json.url);
        return { ...prev, images };
      });
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Upload failed"));
    }
    setUploading(null);
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const url = isEdit ? `/api/admin/products/${productId}` : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `Server error: ${res.status}`);

      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Something went wrong"));
      setSaving(false);
    }
  };

  const categories = [
    { value: "Lab Diamonds", label: "Lab Diamonds", color: "bg-neutral-100 text-neutral-700 border-neutral-200" },
    { value: "Lab Sapphires", label: "Lab Sapphires", color: "bg-blue-50 text-blue-700 border-blue-200" },
    { value: "Lab Emeralds", label: "Lab Emeralds", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    { value: "Lab Rubies", label: "Lab Rubies", color: "bg-rose-50 text-rose-700 border-rose-200" },
    { value: "Other Gemstones", label: "Other Gemstones", color: "bg-violet-50 text-violet-700 border-violet-200" },
  ];

  const maxImages = 5;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {/* Error banner */}
      {error && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-sm">
          {error}
          <button type="button" onClick={() => setError("")} className="ml-2 underline">Dismiss</button>
        </div>
      )}

      {/* Name */}
      <div>
        <label className="block text-sm font-medium mb-1.5">Product Name</label>
        <Input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Bezel Lab Diamond Pendant" />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1.5">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required rows={5}
          placeholder="Describe the piece..."
          className="flex w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm resize-y"
        />
      </div>

      {/* Price & Stock */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Price (USD)</label>
          <Input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} required placeholder="168.00" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Stock</label>
          <Input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required placeholder="5" />
        </div>
      </div>

      {/* Jewelry specifications */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-md border border-border/70 p-4">
        <div className="sm:col-span-2">
          <h2 className="text-sm font-semibold">Jewelry Specifications</h2>
          <p className="mt-1 text-xs text-muted-foreground">These details appear on the public product page.</p>
        </div>
        <SpecInput label="Stone Type" name="stoneType" value={form.stoneType || ""} onChange={handleChange} placeholder="Lab-grown diamond" />
        <SpecInput label="Metal" name="metal" value={form.metal || ""} onChange={handleChange} placeholder="925 Sterling Silver" />
        <SpecInput label="Carat Weight" name="caratWeight" value={form.caratWeight || ""} onChange={handleChange} placeholder="0.50 ct total" />
        <SpecInput label="Cut" name="cut" value={form.cut || ""} onChange={handleChange} placeholder="Round brilliant" />
        <SpecInput label="Color" name="color" value={form.color || ""} onChange={handleChange} placeholder="Near-colorless" />
        <SpecInput label="Clarity" name="clarity" value={form.clarity || ""} onChange={handleChange} placeholder="VS equivalent" />
        <SpecInput label="Certification" name="certification" value={form.certification || ""} onChange={handleChange} placeholder="Certificate available" />
        <SpecInput label="Dimensions" name="dimensions" value={form.dimensions || ""} onChange={handleChange} placeholder="6 mm setting" />
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1.5">Care</label>
          <textarea
            name="care"
            value={form.care || ""}
            onChange={handleChange}
            rows={3}
            placeholder="Clean with a soft cloth and store separately."
            className="flex w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm resize-y"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Product Type</label>
        <select
          name="productType"
          value={form.productType || "Ring"}
          onChange={handleChange}
          className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
        >
          <option value="Ring">Ring</option>
          <option value="Necklace">Necklace</option>
          <option value="Earrings">Earrings</option>
          <option value="Bracelet">Bracelet</option>
        </select>
      </div>

      {/* Stone category */}
      <div>
        <label className="block text-sm font-medium mb-1.5">Stone Category</label>
        <div className="flex gap-3">
          {categories.map((cat) => (
            <label key={cat.value} className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-md border transition-all ${form.category === cat.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
              <input type="radio" name="category" value={cat.value} checked={form.category === cat.value} onChange={handleChange} className="sr-only" />
              <Badge variant="secondary" className={`text-xs pointer-events-none ${cat.color}`}>{cat.label}</Badge>
            </label>
          ))}
        </div>
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium mb-2">Product Images ({form.images.length}/{maxImages})</label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {form.images.map((url, i) => (
            <div key={i} className="relative group">
              <img src={url} alt="" className="w-full aspect-square rounded-lg object-cover border bg-secondary" />
              <button type="button" onClick={() => removeImage(i)} className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow">✕</button>
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <span className="text-white text-xs font-medium">Replace</span>
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, i)} className="hidden" />
              </label>
            </div>
          ))}
          {form.images.length < maxImages && (
            <label className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors gap-1">
              {uploading === -1 ? (
                <span className="text-xs text-muted-foreground">Uploading...</span>
              ) : (
                <>
                  <svg className="w-6 h-6 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                  <span className="text-xs text-muted-foreground">Add</span>
                </>
              )}
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e)} className="hidden" />
            </label>
          )}
        </div>
      </div>

      {/* Featured */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 rounded border-input text-primary focus:ring-primary" />
          <span className="text-sm font-medium">Show on homepage (Featured)</span>
        </label>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-4 border-t">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}

function SpecInput({
  label,
  name,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  name: keyof ProductFormData;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholder: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <Input name={name} value={value} onChange={onChange} placeholder={placeholder} />
    </div>
  );
}
