import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getProductPage } from "@/lib/product-data";

export const dynamic = "force-dynamic";

function parseImages(images: string): string[] {
  try {
    return JSON.parse(images);
  } catch {
    return [];
  }
}

interface Props {
  searchParams: Promise<{ category?: string; type?: string; stone?: string; collection?: string; page?: string }>;
}

const PRODUCTS_PER_PAGE = 12;

const filters = [
  { label: "All", href: "/products", match: "all" },
  { label: "New In", href: "/products?collection=new", match: "new" },
  { label: "Rings", href: "/products?type=Ring", match: "type:Ring" },
  { label: "Necklaces", href: "/products?type=Necklace", match: "type:Necklace" },
  { label: "Earrings", href: "/products?type=Earrings", match: "type:Earrings" },
  { label: "Bracelets", href: "/products?type=Bracelet", match: "type:Bracelet" },
];

export default async function ProductsPage({ searchParams }: Props) {
  const { category, type, stone, collection, page } = await searchParams;
  const selectedCategory = category && category !== "All" ? category : undefined;
  const selectedStone = stone === "Diamond" || stone === "Color" ? stone : undefined;
  const selectedType = type || undefined;
  const requestedPage = Number.parseInt(page || "1", 10);
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

  const productPage = await getProductPage(
    {
      category: selectedCategory,
      productType: selectedType,
      stoneGroup: selectedStone,
      newOnly: collection === "new",
    },
    {
      page: Number.isFinite(requestedPage) ? requestedPage : 1,
      pageSize: PRODUCTS_PER_PAGE,
    }
  );
  const { products, totalCount, totalPages } = productPage;

  function pageHref(nextPage: number) {
    const params = new URLSearchParams();
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedType) params.set("type", selectedType);
    if (selectedStone) params.set("stone", selectedStone);
    if (collection === "new") params.set("collection", "new");
    if (nextPage > 1) params.set("page", String(nextPage));
    const query = params.toString();
    return query ? `/products?${query}` : "/products";
  }

  return (
    <div>
      <section className="border-b bg-white">
        <div className="container mx-auto px-4 py-9 text-left sm:px-6 sm:py-18 sm:text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.28em] text-primary/70 sm:mb-4">The Collection</p>
          <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">Lab-grown jewelry essentials</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:mt-4">
            Shop new arrivals and everyday jewelry by piece type.
          </p>
          <p className="mt-3 text-sm text-muted-foreground sm:mt-4">
            {totalCount} {totalCount === 1 ? "piece" : "pieces"}
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
                      <div className="relative aspect-square overflow-hidden bg-muted/30">
                        {firstImg && (
                          <Image
                            src={firstImg}
                            alt={product.name}
                            fill
                            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 50vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
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

          {totalPages > 1 && (
            <nav className="mt-10 flex items-center justify-center gap-3 sm:mt-12" aria-label="Product pages">
              <Link
                href={pageHref(Math.max(1, productPage.page - 1))}
                aria-disabled={productPage.page === 1}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
                  productPage.page === 1
                    ? "pointer-events-none border-border text-muted-foreground/50"
                    : "border-border bg-white text-foreground hover:border-foreground/40"
                }`}
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Previous page</span>
              </Link>
              <span className="min-w-28 text-center text-sm text-muted-foreground">
                Page {productPage.page} of {totalPages}
              </span>
              <Link
                href={pageHref(Math.min(totalPages, productPage.page + 1))}
                aria-disabled={productPage.page === totalPages}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
                  productPage.page === totalPages
                    ? "pointer-events-none border-border text-muted-foreground/50"
                    : "border-border bg-white text-foreground hover:border-foreground/40"
                }`}
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Next page</span>
              </Link>
            </nav>
          )}
        </div>
      </section>
    </div>
  );
}
