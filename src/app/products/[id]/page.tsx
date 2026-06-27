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

function getStoneDetails(category: string) {
  const details: Record<string, { material: string; stone: string; color: string }> = {
    "Lab Diamonds": {
      material: "Lab-grown diamond with 925 sterling silver",
      stone: "Lab-grown diamond",
      color: "Near-colorless white",
    },
    "Lab Sapphires": {
      material: "Lab-grown sapphire with 925 sterling silver",
      stone: "Lab-grown sapphire",
      color: "Blue sapphire",
    },
    "Lab Emeralds": {
      material: "Lab-grown emerald with 925 sterling silver",
      stone: "Lab-grown emerald",
      color: "Green emerald",
    },
    "Lab Rubies": {
      material: "Lab-grown ruby with 925 sterling silver",
      stone: "Lab-grown ruby",
      color: "Ruby red",
    },
  };

  return details[category] || {
    material: "Lab-grown gemstone jewelry",
    stone: "Lab-grown gemstone",
    color: "As shown",
  };
}

interface Product {
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
  const defaults = getStoneDetails(product.category);
  const specs = [
    ["Stone", product.stoneType || defaults.stone],
    ["Metal", product.metal || defaults.material],
    ["Carat Weight", product.caratWeight],
    ["Cut", product.cut],
    ["Color", product.color || defaults.color],
    ["Clarity", product.clarity],
    ["Certification", product.certification],
    ["Dimensions", product.dimensions],
  ].filter(([, value]) => value);

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
          <Badge variant="secondary" className="mb-3 w-fit rounded-sm bg-muted text-foreground">{product.category}</Badge>
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
                <span className="text-sm text-muted-foreground">
                  {product.stock} in stock{product.stock <= 5 && " - limited quantity"}
                </span>
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
          <div className="mt-10 border-t border-border/40 pt-8 font-sans">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Details</h2>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {specs.map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
                  <p className="mt-1 text-sm font-medium">{value}</p>
                </div>
              ))}
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Shipping</p>
                <p className="mt-1 text-sm font-medium">Free worldwide over $150</p>
              </div>
            </div>
          </div>

          {product.care && (
            <div className="mt-8 border-t border-border/40 pt-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Care</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{product.care}</p>
            </div>
          )}

          <p className="mt-6 text-xs leading-5 text-muted-foreground">
            Lab-grown gemstones are disclosed clearly. Product images and stone color may vary slightly by screen and batch.
          </p>
        </div>
      </div>
    </div>
  );
}
