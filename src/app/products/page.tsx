import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

function parseImages(images: string): string[] {
  try { return JSON.parse(images); } catch { return []; }
}

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
    const products = await prisma.product.findMany({
    where: undefined,
    orderBy: { createdAt: "desc" },
  });
  

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 to-emerald-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(199,169,110,0.08),transparent_50%)]" />
        <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 relative z-10 text-center">
          <p className="text-xs font-medium tracking-[0.25em] uppercase text-amber-400/70 mb-4 font-sans">The Collection</p>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-white">Collection</h1>
          <div className="flex items-center justify-center gap-4 my-5">
            <div className="h-px w-8 bg-amber-400/30" /><svg width="8" height="8" viewBox="0 0 8 8" className="text-amber-400/50"><circle cx="4" cy="4" r="1.5" fill="currentColor" /></svg><div className="h-px w-8 bg-amber-400/30" />
          </div>
          <p className="text-emerald-100/60 font-sans text-sm">{products.length} {products.length === 1 ? "piece" : "pieces"} in the collection</p>
          
        </div>
      </section>

      <section className="py-14 sm:py-18 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          {products.length === 0 ? (
            <div className="text-center py-28"><p className="text-muted-foreground text-lg font-sans">No pieces found.</p></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => {
                const imgs = parseImages(product.images);
                const firstImg = imgs[0] || "";
                return (
                  <Link key={product.id} href={`/products/${product.id}`}>
                    <Card className="group h-full overflow-hidden border-border/40 transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                      <div className="aspect-square overflow-hidden bg-secondary/20">
                        {firstImg && <img src={firstImg} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />}
                      </div>
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-3">
                          
                          {product.stock <= 3 && product.stock > 0 && <span className="text-xs text-muted-foreground font-sans">Only {product.stock} left</span>}
                          {product.stock === 0 && <span className="text-xs text-destructive font-sans">Sold out</span>}
                        </div>
                        <h3 className="font-serif font-bold text-base leading-tight line-clamp-2">{product.name}</h3>
                        <p className="mt-2 text-xl font-bold text-foreground font-sans">${product.price.toFixed(2)}</p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
