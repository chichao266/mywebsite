"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";

function parseImages(images: string): string[] {
  try { return JSON.parse(images); } catch { return []; }
}

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string;
  category: string;
  stoneType?: string | null;
  metal?: string | null;
  caratWeight?: string | null;
  cut?: string | null;
  color?: string | null;
  clarity?: string | null;
  certification?: string | null;
  dimensions?: string | null;
  care?: string | null;
  stock: number;
  featured: boolean;
};

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((products: Product[]) => {
        const found = products.find((p) => p.id === id);
        setProduct(found || null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Loading...</div>;
  }

  if (!product) {
    return <div className="container mx-auto px-4 py-20 text-center"><p className="text-muted-foreground">Product not found.</p></div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 max-w-2xl">
      <h1 className="text-2xl font-serif font-bold mb-2">Edit Product</h1>
      <p className="text-sm text-muted-foreground mb-8">{product.name}</p>
      <ProductForm
        isEdit
        productId={id}
        initial={{
          name: product.name,
          description: product.description,
          price: String(product.price),
          images: parseImages(product.images),
          category: product.category,
          stoneType: product.stoneType || "",
          metal: product.metal || "",
          caratWeight: product.caratWeight || "",
          cut: product.cut || "",
          color: product.color || "",
          clarity: product.clarity || "",
          certification: product.certification || "",
          dimensions: product.dimensions || "",
          care: product.care || "",
          stock: String(product.stock),
          featured: product.featured,
        }}
      />
    </div>
  );
}
