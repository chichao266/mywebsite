"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  images: string;
}

function parseImages(images: string): string[] {
  try { return JSON.parse(images); } catch { return []; }
}

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.products || []);
        }
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (e.key === "Enter" && query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Dialog */}
      <div className="absolute top-0 left-0 right-0 bg-white border-b shadow-2xl">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3 max-w-2xl mx-auto">
            {loading ? (
              <Loader2 className="w-5 h-5 text-muted-foreground animate-spin shrink-0" />
            ) : (
              <Search className="w-5 h-5 text-muted-foreground shrink-0" />
            )}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search jewelry, stones, collections..."
              className="flex-1 bg-transparent text-foreground text-base outline-none placeholder:text-muted-foreground/60"
            />
            <button
              onClick={onClose}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results */}
        {query.trim() && (
          <div className="border-t">
            <div className="container mx-auto px-4 sm:px-6 py-4 max-w-2xl mx-auto">
              {results.length > 0 ? (
                <div className="space-y-1">
                  {results.slice(0, 6).map((product) => {
                    const images = parseImages(product.images);
                    const thumb = images[0];
                    return (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        onClick={onClose}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        {thumb ? (
                          <img src={thumb} alt="" className="w-12 h-12 rounded-md object-cover bg-muted/30 shrink-0" />
                        ) : (
                          <div className="w-12 h-12 rounded-md bg-muted/30 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.category} · ${product.price.toFixed(2)}</p>
                        </div>
                      </Link>
                    );
                  })}
                  <Link
                    href={`/products?search=${encodeURIComponent(query)}`}
                    onClick={onClose}
                    className="block text-center text-sm text-primary hover:underline py-2"
                  >
                    View all results →
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  {loading ? "Searching..." : "No results found. Try a different keyword."}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
