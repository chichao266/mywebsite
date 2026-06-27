import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getProducts } from "@/lib/product-data";

export const dynamic = "force-dynamic";

function parseImages(images: string): string[] {
  try {
    return JSON.parse(images);
  } catch {
    return [];
  }
}

interface Props {
  searchParams: Promise<{ category?: string; type?: string; stone?: string; collection?: string }>;
}

const filters = [
  { label: "All", href: "/products", match: "all" },
  { label: "New In", href: "/products?collection=new", match: "new" },
  { label: "Rings", href: "/products?type=Ring", match: "type:Ring" },
  { label: "Necklaces", href: "/products?type=Necklace", match: "type:Necklace" },
  { label: "Earrings", href: "/products?type=Earrings", match: "type:Earrings" },
  { label: "Bracelets", href: "/products?type=Bracelet", match: "type:Bracelet" },
  { label: "Diamonds", href: "/products?stone=Diamond", match: "stone:Diamond" },
  { label: "Color", href: "/products?stone=Color", match: "stone:Color" },
];

export default async function ProductsPage({ searchParams }: Props) {
  const { category, type, stone, collection } = await searchParams;
  const selectedCategory = category && category !== "All" ? category : undefined;
  const selectedStone = stone === "Diamond" || stone === "Color" ? stone : undefined;
  const selectedType = type || undefined;
  const activeFilter =
    collection === "new"
      ? "new"
      : selectedType
        ? `type:${selectedType}`
        : selectedStone
          ? `stone:${selectedStone}`
          : selectedCategory
            ? `category:${selectedCategory}`
            : "all";

  const products = await getProducts({
    category: selectedCategory,
    productType: selectedType,
    stoneGroup: selectedStone,
    newOnly: collection === "new",
  });

  return (
    <div>
      <section className="border-b bg-white">
        <div className="container mx-auto px-4 py-9 text-left sm:px-6 sm:py-18 sm:text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.28em] text-primary/70 sm:mb-4">The Collection</p>
          <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">Lab-grown jewelry essentials</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:mt-4">
            Shop by jewelry type or by stone: everyday 925 silver pieces, lab-grown diamonds, and colored gemstones.
          </p>
          <p className="mt-3 text-sm text-muted-foreground sm:mt-4">
            {products.length} {products.length === 1 ? "piece" : "pieces"}
          </p>
        </div>
      </section>

      <section className="sticky top-16 z-30 border-b bg-background/95 py-3 backdrop-blur sm:static sm:border-b-0 sm:py-7">
        <div className="container mx-auto flex gap-2 overflow-x-auto px-4 sm:px-6">
          {filters.map((item) => {
            const active = activeFilter === item.match;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm transition-colors ${
                  active ? "border-foreground bg-foreground text-background" : "border-border bg-white text-foreground hover:border-foreground/40"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-background pb-16 pt-5 sm:pb-20 sm:pt-0">
        <div className="container mx-auto px-4 sm:px-6">
          {products.length === 0 ? (
            <div className="py-28 text-center">
              <p className="text-lg text-muted-foreground">No pieces found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => {
                const imgs = parseImages(product.images);
                const firstImg = imgs[0];
                return (
                  <Link key={product.id} href={`/products/${product.id}`}>
                    <Card className="group h-full overflow-hidden rounded-md border-border/60 shadow-none transition-colors hover:border-foreground/30">
                      <div className="aspect-square overflow-hidden bg-muted/30">
                        {firstImg && (
                          <img
                            src={firstImg}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        )}
                      </div>
                      <CardContent className="p-3 sm:p-5">
                        <div className="mb-2 flex items-center justify-between gap-2 sm:mb-3">
                          <Badge variant="secondary" className="max-w-full truncate rounded-sm bg-white px-1.5 text-[10px] text-foreground sm:px-2.5 sm:text-xs">
                            {product.category}
                          </Badge>
                          <span className={`hidden text-xs sm:inline ${product.stock === 0 ? "text-destructive" : "text-muted-foreground"}`}>
                            {product.stock === 0 ? "Sold out" : `${product.stock} in stock`}
                          </span>
                        </div>
                        <h2 className="line-clamp-2 font-serif text-sm font-semibold leading-tight sm:text-base">{product.name}</h2>
                        <p className="mt-2 text-base font-semibold sm:mt-3 sm:text-lg">${product.price.toFixed(2)}</p>
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
