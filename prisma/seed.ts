import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function imgs(...urls: string[]) {
  return JSON.stringify(urls);
}

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  const products = [
    {
      name: "Banded Agate Pendant — Horizon",
      description:
        "A cross-section of natural banded agate in a sterling silver frame. The bands record millions of years of mineral deposition. No two are alike.",
      price: 72.0,
      images: imgs(
        "https://images.unsplash.com/photo-1599643478518-a530e902a692?w=600",
        "https://images.unsplash.com/photo-1609767156260-b99f5fc6e0cc?w=600"
      ),
      category: "Agate",
      stock: 4,
      featured: true,
    },
    {
      name: "Banded Agate Ring — Earth Tone",
      description:
        "A statement ring featuring a large oval cabochon of layered agate in warm earth tones — amber, cream, and deep brown. Set in sterling silver.",
      price: 89.0,
      images: imgs(
        "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600",
        "https://images.unsplash.com/photo-1599643478518-a530e902a692?w=600"
      ),
      category: "Agate",
      stock: 7,
      featured: false,
    },
    {
      name: "Agate Bead Bracelet — Canyon",
      description:
        "Twenty-four polished agate beads in a gradient from pale sand to deep rust. Individually selected and arranged by hand.",
      price: 58.0,
      images: imgs(
        "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600",
        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600"
      ),
      category: "Agate",
      stock: 10,
      featured: false,
    },
    {
      name: "Agate Mosaic Earrings — Tessera",
      description:
        "Small squares of sliced agate arranged like mosaic tiles. Paper-thin slices, light as air on the ear.",
      price: 65.0,
      images: imgs(
        "https://images.unsplash.com/photo-1601822153962-de46a3e6b12f?w=600",
        "https://images.unsplash.com/photo-1609767156260-b99f5fc6e0cc?w=600"
      ),
      category: "Agate",
      stock: 5,
      featured: false,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log(`✅ Seeded ${products.length} products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
