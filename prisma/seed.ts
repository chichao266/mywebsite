import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  {
    name: "Wireless Headphones",
    description: "Premium noise-cancelling wireless headphones with 30-hour battery life.",
    price: 79.99,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    category: "Electronics",
    stock: 50,
    featured: true,
  },
  {
    name: "Minimalist Watch",
    description: "Elegant minimalist watch with leather strap. Japanese quartz movement.",
    price: 129.99,
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    category: "Accessories",
    stock: 30,
    featured: true,
  },
  {
    name: "Cotton T-Shirt",
    description: "Soft 100% organic cotton t-shirt. Pre-shrunk, available in multiple colors.",
    price: 24.99,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    category: "Clothing",
    stock: 100,
    featured: false,
  },
  {
    name: "Stainless Steel Water Bottle",
    description: "Double-wall insulated water bottle. Keeps drinks cold for 24 hours.",
    price: 34.99,
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80",
    category: "Lifestyle",
    stock: 75,
    featured: true,
  },
  {
    name: "Leather Backpack",
    description: "Handcrafted full-grain leather backpack. Fits 15-inch laptop.",
    price: 149.99,
    imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
    category: "Accessories",
    stock: 20,
    featured: false,
  },
];

async function main() {
  console.log("Seeding database...");
  for (const product of products) {
    const p = await prisma.product.create({ data: product });
    console.log(`  Created: ${p.name}`);
  }
  const count = await prisma.product.count();
  console.log(`Done. ${count} products in database.`);
}

main()
  .catch((e) => {
    console.error(e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
