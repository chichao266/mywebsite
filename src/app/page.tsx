import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

function parseImages(images: string): string[] {
  try { return JSON.parse(images); } catch { return []; }
}

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { featured: true },
    take: 8,
    orderBy: { createdAt: "desc" },
  });

  const features = [
    {
      title: "Source",
      sub: "Trusted Origins",
      desc: "We source natural agate from multiple origins worldwide — no middlemen, no shortcuts.",
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />,
    },
    {
      title: "Craft",
      sub: "Master Artisans",
      desc: "Each piece is hand-carved and hand-polished. No machines can replicate the warmth and subtlety of human touch on natural stone.",
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />,
    },
    {
      title: "Promise",
      sub: "Natural Only",
      desc: "Every stone is natural — no dyes, no synthetics. If it doesn't meet our standard, it doesn't leave the workshop.",
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />,
    },
  ];

  return (
    <div>
      {/* ═══════════════ HERO — full-image background ═══════════════ */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 flex flex-col md:flex-row">
          <div className="flex-1 relative">
            <img src="/images/22.jpg" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 relative hidden md:block">
            <img src="/images/23.jpg" alt="" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="absolute inset-0 bg-black/35 md:bg-black/30" />

        <div className="container mx-auto px-4 sm:px-6 py-20 sm:py-28 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-medium tracking-[0.35em] uppercase text-white/80 mb-6">
              Handcrafted Natural Stone Jewelry
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight leading-[1.12] text-white drop-shadow-lg">
              Every stone<br />
              <span className="text-accent">carries a melody</span>
            </h1>
            <div className="flex items-center justify-center gap-4 my-8">
              <div className="h-px w-10 bg-white/40" />
              <svg width="10" height="10" viewBox="0 0 12 12" className="text-white/50">
                <circle cx="6" cy="6" r="2" fill="currentColor" />
              </svg>
              <div className="h-px w-10 bg-white/40" />
            </div>
            <p className="text-base sm:text-lg text-white/80 max-w-xl mx-auto leading-relaxed drop-shadow">
              Agate, shaped by the earth over millions of years, finished by hand.
              From bold-banded pattern stones to quiet solid hues — each piece carries the weight of deep time.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="text-base px-10 bg-accent hover:bg-accent/90 text-white font-semibold border-0 shadow-lg shadow-accent/25">
                  Explore Collection
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="text-base px-10 border-white/60 text-white bg-white/10 hover:bg-white/20 hover:border-white">
                  Our Story
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-3">
            {features.map((item) => (
              <div
                key={item.title}
                className="text-center p-8 rounded-2xl border border-border/60 hover:border-accent/20 hover:shadow-md transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 text-accent mb-6">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    {item.icon}
                  </svg>
                </div>
                <p className="text-xs font-medium tracking-widest uppercase text-accent/60 mb-2">{item.sub}</p>
                <h3 className="text-xl font-serif font-bold">{item.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURED PRODUCTS ═══════════════ */}
      {products.length > 0 && (
        <section className="py-16 sm:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">Featured Pieces</h2>
                <p className="mt-2 text-muted-foreground text-sm">Handpicked favorites from our collection.</p>
              </div>
              <Link href="/products" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2.5 transition-all">
                View All <span>→</span>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => {
                const images = parseImages(product.images);
                const firstImg = images.length > 0 ? images[0] : null;
                return (
                  <Link key={product.id} href={`/products/${product.id}`} className="group">
                    <Card className="border border-border/60 overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                      <div className="aspect-square bg-muted/30 overflow-hidden">
                        {firstImg ? (
                          <img src={firstImg} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No image</div>
                        )}
                      </div>
                      <CardContent className="p-5">
                        <Badge variant="secondary" className={`mb-3 text-xs font-sans ${product.category === "Agate" ? "bg-accent/10 text-accent border-accent/20" : "bg-primary/10 text-primary border-primary/20"}`}>
                          {product.category}
                        </Badge>
                        <h3 className="font-serif font-bold text-base leading-tight line-clamp-2">{product.name}</h3>
                        <div className="flex items-baseline gap-2 mt-3">
                          <span className="text-xl font-bold text-foreground">${product.price.toFixed(2)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
            <div className="mt-10 text-center sm:hidden">
              <Link href="/products"><Button variant="outline" className="text-sm">View All Products →</Button></Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="py-16 sm:py-20 bg-accent/5">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold tracking-tight">
            Wear a story millions of years<br />
            <span className="text-accent">in the making</span>
          </h2>
          <div className="flex items-center justify-center gap-4 my-8">
            <div className="h-px w-12 bg-accent/20" />
            <svg width="10" height="10" viewBox="0 0 12 12" className="text-accent/30"><circle cx="6" cy="6" r="2" fill="currentColor" /></svg>
            <div className="h-px w-12 bg-accent/20" />
          </div>
          <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Each Agatelier piece is a fragment of the earth, shaped by time and finished by hand. Find yours.
          </p>
          <div className="mt-10">
            <Link href="/products">
              <Button size="lg" className="text-base px-12 bg-accent hover:bg-accent/90 text-white font-semibold border-0 shadow-lg shadow-accent/20">
                Explore Collection
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
