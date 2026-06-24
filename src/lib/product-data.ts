import { prisma } from "@/lib/prisma";
import { canUseDemoData } from "@/lib/admin-dev-fallbacks";
import { demoProducts } from "@/lib/demo-products";

function canUseDemoProducts() {
  return canUseDemoData();
}

function fallbackProducts() {
  if (!canUseDemoProducts()) throw new Error("Database is required in production.");
  return demoProducts;
}

export async function getFeaturedProducts(take = 8) {
  try {
    return await prisma.product.findMany({
      where: { featured: true },
      take,
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return fallbackProducts()
      .filter((product) => product.featured)
      .slice(0, take);
  }
}

export async function getProducts(category?: string) {
  try {
    return await prisma.product.findMany({
      where: category ? { category } : undefined,
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return fallbackProducts().filter((product) => !category || product.category === category);
  }
}

export async function getProductById(id: string) {
  try {
    return await prisma.product.findUnique({ where: { id } });
  } catch {
    return fallbackProducts().find((product) => product.id === id) || null;
  }
}
