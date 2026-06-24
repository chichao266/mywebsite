import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getFeaturedProducts } from "@/lib/product-data";

export const dynamic = "force-dynamic";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1800&auto=format&fit=crop&q=85";

function parseImages(images: string): string[] {
  try {
    return JSON.parse(images);
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const products = await getFeaturedProducts(8);

  const values = [
    {
      title: "Lab-grown brilliance",
      desc: "Diamonds and colored gemstones selected for clean color, balanced proportion, and everyday wear.",
    },
    {
      title: "Transparent origin",
      desc: "Every lab-grown diamond or gemstone is clearly described, with no mined-stone ambiguity.",
    },
    {
      title: "Modern fine jewelry",
      desc: "Low-profile settings, refined silhouettes, and pieces designed to live beyond special occasions.",
    },
  ];

  const categories = [
    { name: "Lab Diamonds", href: "/products?category=Lab%20Diamonds", tone: "border-neutral-300" },
    { name: "Sapphires", href: "/products?category=Lab%20Sapphires", tone: "border-blue-300" },
    { name: "Emeralds", href: "/products?category=Lab%20Emeralds", tone: "border-emerald-300" },
    { name: "Rubies", href: "/products?category=Lab%20Rubies", tone: "border-rose-300" },
  ];

  return (
    <div>
      <section className="relative min-h-[82vh] overflow-hidden bg-stone-950">
        <img
          src={HERO_IMAGE}
          alt="Diamond ring in a clean modern setting"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/10" />

        <div className="container relative z-10 mx-auto flex min-h-[82vh] items-center px-4 py-20 sm:px-6">
          <div className="max-w-2xl text-white">
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.32em] text-white/75">
              Lab-grown fine jewelry
            </p>
            <h1 className="font-serif text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Diamonds and color, made for every day.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/78 sm:text-lg">
              Avoryne creates modern lab-grown diamond and colored gemstone jewelry with clear origin,
              refined settings, and an easy international sensibility.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-white px-8 text-stone-950 hover:bg-white/90">
                <Link href="/products">Shop the Collection</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/60 bg-white/10 px-8 text-white hover:bg-white/20"
              >
                <Link href="/about">Our Standards</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border/60 bg-white">
        <div className="container mx-auto grid gap-0 px-4 sm:px-6 md:grid-cols-3">
          {values.map((item) => (
            <div key={item.title} className="border-border/60 py-9 md:border-r md:px-8 md:last:border-r-0">
              <h2 className="font-serif text-xl font-semibold tracking-tight">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-background py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary/70">Shop by stone</p>
              <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight">A cleaner way to collect color.</h2>
            </div>
            <Link href="/products" className="text-sm font-medium text-foreground hover:text-primary">
              View all pieces
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className={`group border-t-2 ${category.tone} bg-white p-6 transition-colors hover:bg-muted/40`}
              >
                <p className="font-serif text-xl font-semibold">{category.name}</p>
                <p className="mt-8 text-sm text-muted-foreground group-hover:text-foreground">Explore</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {products.length > 0 && (
        <section className="bg-white py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary/70">New essentials</p>
                <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight">Featured Pieces</h2>
              </div>
              <Link href="/products" className="hidden text-sm font-medium text-foreground hover:text-primary sm:inline-flex">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => {
                const images = parseImages(product.images);
                const firstImg = images[0];
                return (
                  <Link key={product.id} href={`/products/${product.id}`} className="group">
                    <Card className="h-full overflow-hidden rounded-md border-border/60 shadow-none transition-colors hover:border-foreground/30">
                      <div className="aspect-square overflow-hidden bg-muted/30">
                        {firstImg ? (
                          <img
                            src={firstImg}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                            No image
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4 sm:p-5">
                        <Badge variant="secondary" className="mb-3 rounded-sm bg-muted text-xs text-foreground">
                          {product.category}
                        </Badge>
                        <h3 className="line-clamp-2 font-serif text-base font-semibold leading-tight">{product.name}</h3>
                        <p className="mt-3 text-base font-semibold">${product.price.toFixed(2)}</p>
                        <p className={`mt-2 text-xs ${product.stock === 0 ? "text-destructive" : "text-muted-foreground"}`}>
                          {product.stock === 0 ? "Sold out" : `${product.stock} in stock`}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="bg-stone-950 py-16 text-white sm:py-20">
        <div className="container mx-auto grid gap-10 px-4 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-white/55">Lab-grown, clearly labeled</p>
            <h2 className="mt-4 max-w-2xl font-serif text-3xl font-bold tracking-tight sm:text-4xl">
              The sparkle is real. The origin is transparent.
            </h2>
          </div>
          <div className="text-sm leading-7 text-white/70">
            Our product language is intentionally clear: lab-grown diamonds, lab-grown sapphires,
            lab-grown rubies, and lab-grown emeralds. No vague claims, no mined-stone confusion.
          </div>
        </div>
      </section>
    </div>
  );
}
