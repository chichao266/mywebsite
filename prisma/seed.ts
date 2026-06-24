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
      name: "Solitaire Lab Diamond Studs",
      description:
        "A clean everyday pair of lab-grown diamond studs in a low-profile basket setting. Designed for daily shine, easy gifting, and effortless layering.",
      price: 168.0,
      images: imgs(
        "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=900&auto=format&fit=crop&q=85",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&auto=format&fit=crop&q=85"
      ),
      category: "Lab Diamonds",
      stoneType: "Lab-grown diamond",
      metal: "14k gold vermeil",
      caratWeight: "0.50 ct total",
      cut: "Round brilliant",
      color: "Near-colorless",
      clarity: "VS equivalent",
      certification: "Certificate available",
      dimensions: "4 mm stones",
      care: "Clean with a soft cloth and store separately from harder jewelry.",
      stock: 12,
      featured: true,
    },
    {
      name: "Bezel Lab Diamond Pendant",
      description:
        "A single lab-grown diamond set in a smooth bezel pendant. Minimal, polished, and made to sit close to the collarbone.",
      price: 220.0,
      images: imgs(
        "https://images.unsplash.com/photo-1599643478518-a530e902a692?w=900&auto=format&fit=crop&q=85",
        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=900&auto=format&fit=crop&q=85"
      ),
      category: "Lab Diamonds",
      stoneType: "Lab-grown diamond",
      metal: "Sterling silver",
      caratWeight: "0.30 ct",
      cut: "Round brilliant",
      color: "Near-colorless",
      clarity: "VS equivalent",
      certification: "Certificate available",
      dimensions: "16-18 in adjustable chain",
      care: "Avoid harsh cleaners. Polish gently with a soft jewelry cloth.",
      stock: 8,
      featured: true,
    },
    {
      name: "Oval Lab Sapphire Ring",
      description:
        "A deep blue lab-grown sapphire in a refined oval setting. Finished with a slender band for a modern color statement.",
      price: 260.0,
      images: imgs(
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=900&auto=format&fit=crop&q=85",
        "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=900&auto=format&fit=crop&q=85"
      ),
      category: "Lab Sapphires",
      stoneType: "Lab-grown sapphire",
      metal: "14k gold vermeil",
      caratWeight: "1.20 ct center stone",
      cut: "Oval",
      color: "Deep blue",
      clarity: "Eye-clean",
      certification: "Stone origin disclosed",
      dimensions: "7 x 5 mm center stone",
      care: "Remove before swimming or applying lotion. Store in a dry pouch.",
      stock: 5,
      featured: true,
    },
    {
      name: "Emerald Line Pendant",
      description:
        "A slim pendant with a lab-grown emerald accent, balancing clear color with a simple silhouette for everyday wear.",
      price: 190.0,
      images: imgs(
        "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=900&auto=format&fit=crop&q=85",
        "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=900&auto=format&fit=crop&q=85"
      ),
      category: "Lab Emeralds",
      stoneType: "Lab-grown emerald",
      metal: "Sterling silver",
      caratWeight: "0.40 ct",
      cut: "Baguette",
      color: "Emerald green",
      clarity: "Light garden visible",
      certification: "Stone origin disclosed",
      dimensions: "16-18 in adjustable chain",
      care: "Clean with a damp soft cloth. Avoid ultrasonic cleaners.",
      stock: 7,
      featured: true,
    },
    {
      name: "Ruby Petite Huggies",
      description:
        "Small huggie earrings with lab-grown ruby accents. A quiet flash of red designed for daily color, not occasion-only dressing.",
      price: 145.0,
      images: imgs(
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=900&auto=format&fit=crop&q=85",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=900&auto=format&fit=crop&q=85"
      ),
      category: "Lab Rubies",
      stoneType: "Lab-grown ruby",
      metal: "Gold vermeil",
      caratWeight: "0.18 ct total",
      cut: "Round",
      color: "Ruby red",
      clarity: "Eye-clean",
      certification: "Stone origin disclosed",
      dimensions: "12 mm huggie diameter",
      care: "Close clasps before storage and keep away from perfume.",
      stock: 10,
      featured: false,
    },
    {
      name: "Diamond Tennis Mini Bracelet",
      description:
        "A delicate line bracelet inspired by classic tennis jewelry, scaled down for daily styling with lab-grown diamond sparkle.",
      price: 340.0,
      images: imgs(
        "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=900&auto=format&fit=crop&q=85",
        "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=900&auto=format&fit=crop&q=85"
      ),
      category: "Lab Diamonds",
      stoneType: "Lab-grown diamond",
      metal: "Sterling silver",
      caratWeight: "1.00 ct total",
      cut: "Round brilliant",
      color: "Near-colorless",
      clarity: "VS equivalent",
      certification: "Certificate available",
      dimensions: "6.5 in with extender",
      care: "Lay flat when stored and wipe with a dry soft cloth after wear.",
      stock: 4,
      featured: true,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log(`Seeded ${products.length} Lumea products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
