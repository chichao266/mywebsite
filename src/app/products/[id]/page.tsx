"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "@/components/add-to-cart-button";

function parseImages(images: string): string[] {
  try { return JSON.parse(images); } catch { return []; }
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string;
  category: string;
  stock: number;
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainIndex, setMainIndex] = useState(0);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((found: Product | { error: string }) => {
        setProduct("error" in found ? null : found);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Loading...</div>;
  }

  if (!product) {
    notFound();
  }

  const images = parseImages(product.images);
  const inStock = product.stock > 0;

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8 font-sans">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-foreground transition-colors">Collection</Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* ── Image Gallery ── */}
        <div>
          {/* Main Image */}
          <div className="relative aspect-square overflow-hidden rounded-xl bg-secondary/20 border border-border/40">
            {images[mainIndex] ? (
              <img src={images[mainIndex]} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground">No image</div>
            )}
            {!inStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm rounded-xl">
                <Badge variant="destructive" className="text-base px-6 py-2">Sold Out</Badge>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 mt-4">
              {images.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setMainIndex(i)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    i === mainIndex ? "border-primary ring-2 ring-primary/20" : "border-border/40 hover:border-primary/40"
                  }`}
                >
                  <img src={url} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Info ── */}
        <div className="flex flex-col justify-center">
          <Badge variant="secondary" className={`w-fit mb-3 ${product.category === "Agate" ? "bg-amber-400/10 text-amber-600 border-amber-400/20" : "bg-primary/10 text-primary border-primary/20"}`}>{product.category}</Badge>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight leading-tight">{product.name}</h1>
          <p className="mt-4 text-3xl font-bold text-foreground font-sans">${product.price.toFixed(2)}</p>

          <div className="mt-6 border-t border-border/40 pt-6">
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line font-sans">{product.description}</p>
          </div>

          {/* Stock */}
          <div className="mt-6 flex items-center gap-2 font-sans">
            {inStock ? (
              <>
                <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm text-muted-foreground">In stock{product.stock <= 5 && ` — only ${product.stock} remaining`}</span>
              </>
            ) : (
              <>
                <span className="inline-block w-2 h-2 rounded-full bg-destructive" />
                <span className="text-sm text-destructive">Out of stock</span>
              </>
            )}
          </div>

          {/* Add to Cart */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <AddToCartButton product={{ id: product.id, name: product.name, price: product.price, imageUrl: images[0] || "", stock: product.stock }} />
            <Button variant="outline" size="lg" asChild className="font-sans"><Link href="/products">← Back to Collection</Link></Button>
          </div>

          {/* Details */}
          <div className="mt-10 grid grid-cols-2 gap-4 border-t border-border/40 pt-8 font-sans">
            <div><p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Material</p><p className="mt-1 text-sm font-medium">{product.category === "Jade" ? "Natural Hetian Jade" : "Natural Banded Agate"}</p></div>
            <div><p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Origin</p><p className="mt-1 text-sm font-medium">{product.category === "Jade" ? "Xinjiang, China" : "Various regions, China"}</p></div>
            <div><p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Handmade</p><p className="mt-1 text-sm font-medium">Hand-finished — patterned stones are one of a kind piece unique</p></div>
            <div><p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Shipping</p><p className="mt-1 text-sm font-medium">Free worldwide over $150</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
