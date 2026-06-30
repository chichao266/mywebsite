import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getFeaturedProducts, getProducts } from "@/lib/product-data";

export const dynamic = "force-dynamic";

const HERO_IMAGE =
  "/images/avoryne-home-hero.png";
const MOBILE_HERO_IMAGE =
  "/images/avoryne-mobile-hero.png";

function parseImages(images: string): string[] {
  try {
    return JSON.parse(images);
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const products = await getFeaturedProducts(8);
  const newProducts = await getProducts({ newOnly: true });

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
    { name: "Rings", href: "/products?type=Ring", tone: "border-neutral-300" },
    { name: "Necklaces", href: "/products?type=Necklace", tone: "border-blue-300" },
    { name: "Earrings", href: "/products?type=Earrings", tone: "border-emerald-300" },
    { name: "Bracelets", href: "/products?type=Bracelet", tone: "border-rose-300" },
  ];

  return (
    <div>
      <section className="relative min-h-[100svh] overflow-hidden bg-stone-950 sm:min-h-[82vh]">
        <Image
          src={MOBILE_HERO_IMAGE}
          alt="Woman wearing blue gemstone earrings and a statement ring"
          fill
          sizes="100vw"
          priority
          className="object-cover object-center sm:hidden"
        />
        <Image
          src={HERO_IMAGE}
          alt="Woman wearing blue gemstone earrings and a statement ring"
          fill
          sizes="100vw"
          priority
          className="hidden object-cover object-center sm:block"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/20 to-black/18 sm:bg-gradient-to-r sm:from-black/70 sm:via-black/35 sm:to-black/10" />

        <div className="container relative z-10 mx-auto flex min-h-[100svh] items-end px-4 pb-16 pt-24 sm:min-h-[82vh] sm:items-center sm:px-6 sm:py-20">
          <div className="w-full max-w-[22rem] text-white sm:max-w-2xl">
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.32em] text-white/75">
              Lab-grown fine jewelry
            </p>
            <h1 className="max-w-full break-words font-serif text-[2rem] font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Wear color like a signature.
            </h1>
            <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="w-full max-w-[18rem] border border-white/45 bg-white/12 px-8 text-white shadow-none backdrop-blur-md hover:bg-white/20 sm:w-auto"
              >
                <Link href="/products">Shop the Collection</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="hidden border-b border-border/60 bg-white md:block">
        <div className="container mx-auto grid gap-0 px-4 sm:px-6 md:grid-cols-3">
          {values.map((item) => (
            <div key={item.title} className="border-border/60 py-9 md:border-r md:px-8 md:last:border-r-0">
              <h2 className="font-serif text-xl font-semibold tracking-tight">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {newProducts.length > 0 && (
        <section className="bg-white py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary/70">Fresh arrivals</p>
                <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight">New In</h2>
              </div>
              <Link href="/products?collection=new" className="text-sm font-medium text-foreground hover:text-primary">
                View all
              </Link>
            </div>
            <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 lg:gap-6">
              {newProducts.slice(0, 4).map((product) => {
                const images = parseImages(product.images);
                const firstImg = images[0];
                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="group w-[42vw] min-w-[42vw] snap-start sm:w-auto sm:min-w-0"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-md bg-muted/30">
                      {firstImg ? (
                        <Image
                          src={firstImg}
                          alt={product.name}
                          fill
                          sizes="(min-width: 640px) 25vw, 42vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>
                    <h3 className="mt-3 line-clamp-2 font-serif text-sm font-semibold leading-tight sm:text-base">{product.name}</h3>
                    <p className="mt-1 text-sm font-semibold sm:text-base">${product.price.toFixed(2)}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="bg-background py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary/70">Shop the edit</p>
              <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight">Start with the piece you wear most.</h2>
            </div>
            <Link href="/products" className="text-sm font-medium text-foreground hover:text-primary">
              View all pieces
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className={`group border-t-2 ${category.tone} bg-white p-4 transition-colors hover:bg-muted/40 sm:p-6`}
              >
                <p className="font-serif text-lg font-semibold sm:text-xl">{category.name}</p>
                <p className="mt-5 text-sm text-muted-foreground group-hover:text-foreground sm:mt-8">Explore</p>
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
                      <div className="relative aspect-square overflow-hidden bg-muted/30">
                        {firstImg ? (
                          <Image
                            src={firstImg}
                            alt={product.name}
                            fill
                            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
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
