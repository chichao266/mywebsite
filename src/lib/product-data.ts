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

export type ProductFilters = {
  category?: string;
  productType?: string;
  stoneGroup?: "Diamond" | "Color";
  newOnly?: boolean;
};

export type ProductPageOptions = {
  page?: number;
  pageSize?: number;
};

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

function matchesFilters(product: { category: string; productType?: string | null; name: string }, filters: ProductFilters) {
  if (filters.category && product.category !== filters.category) return false;
  if (filters.productType) {
    const productType = product.productType || "";
    const name = product.name.toLowerCase();
    const needle = filters.productType.toLowerCase();
    if (productType !== filters.productType && !name.includes(needle.toLowerCase())) return false;
  }
  if (filters.stoneGroup === "Diamond") return product.category === "Lab Diamonds";
  if (filters.stoneGroup === "Color") return product.category !== "Lab Diamonds";
  return true;
}

function getProductWhereParts(filters: ProductFilters) {
  const whereParts = [];

  if (filters.category) whereParts.push({ category: filters.category });
  if (filters.productType) {
    whereParts.push({
      OR: [
        { productType: filters.productType },
        { name: { contains: filters.productType, mode: "insensitive" as const } },
      ],
    });
  }
  if (filters.stoneGroup === "Diamond") {
    whereParts.push({ category: "Lab Diamonds" });
  }
  if (filters.stoneGroup === "Color") {
    whereParts.push({ category: { in: ["Lab Sapphires", "Lab Emeralds", "Lab Rubies", "Other Gemstones"] } });
  }

  return whereParts.length > 0 ? { AND: whereParts } : undefined;
}

export async function getProducts(filters: ProductFilters = {}) {
  try {
    return await prisma.product.findMany({
      where: getProductWhereParts(filters),
      orderBy: { createdAt: "desc" },
      take: filters.newOnly ? 24 : undefined,
    });
  } catch {
    const products = fallbackProducts().filter((product) => matchesFilters(product, filters));
    return filters.newOnly ? products.slice(0, 24) : products;
  }
}

export async function getProductPage(filters: ProductFilters = {}, options: ProductPageOptions = {}) {
  const pageSize = Math.max(1, Math.floor(options.pageSize || 12));
  const requestedPage = Math.max(1, Math.floor(options.page || 1));

  try {
    const where = getProductWhereParts(filters);
    const matchingCount = await prisma.product.count({ where });
    const totalCount = filters.newOnly ? Math.min(matchingCount, 24) : matchingCount;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const page = Math.min(requestedPage, totalPages);
    const skip = (page - 1) * pageSize;
    const take = filters.newOnly ? Math.min(pageSize, Math.max(0, 24 - skip)) : pageSize;
    const products = take > 0
      ? await prisma.product.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip,
          take,
        })
      : [];

    return { products, page, pageSize, totalCount, totalPages };
  } catch {
    const matchingProducts = fallbackProducts().filter((product) => matchesFilters(product, filters));
    const cappedProducts = filters.newOnly ? matchingProducts.slice(0, 24) : matchingProducts;
    const totalCount = cappedProducts.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const page = Math.min(requestedPage, totalPages);
    const start = (page - 1) * pageSize;

    return {
      products: cappedProducts.slice(start, start + pageSize),
      page,
      pageSize,
      totalCount,
      totalPages,
    };
  }
}

export async function getProductById(id: string) {
  try {
    return await prisma.product.findUnique({ where: { id } });
  } catch {
    return fallbackProducts().find((product) => product.id === id) || null;
  }
}
