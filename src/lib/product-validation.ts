const PRODUCT_CATEGORIES = [
  "Lab Diamonds",
  "Lab Sapphires",
  "Lab Emeralds",
  "Lab Rubies",
  "Other Gemstones",
] as const;

const PRODUCT_TYPES = ["Ring", "Necklace", "Earrings", "Bracelet"] as const;

const TEXT_LIMITS = {
  name: 140,
  description: 3000,
  spec: 160,
  care: 1000,
  imageUrl: 1000,
};

export type ProductFormData = {
  name: string;
  description: string;
  price: number;
  category: string;
  productType?: string;
  stoneType?: string;
  metal?: string;
  caratWeight?: string;
  cut?: string;
  color?: string;
  clarity?: string;
  certification?: string;
  dimensions?: string;
  care?: string;
  stock: number;
  featured: boolean;
  images: string;
};

export class ProductValidationError extends Error {}

function cleanString(value: unknown, limit: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, limit);
}

function optionalString(value: unknown, limit = TEXT_LIMITS.spec) {
  const cleaned = cleanString(value, limit);
  return cleaned || undefined;
}

function parseNonNegativeNumber(value: unknown, field: string) {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number) || number < 0) {
    throw new ProductValidationError(`${field} must be a non-negative number.`);
  }
  return Math.round(number * 100) / 100;
}

function parseNonNegativeInteger(value: unknown, field: string) {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(number) || number < 0) {
    throw new ProductValidationError(`${field} must be a non-negative integer.`);
  }
  return number;
}

function isAllowedCategory(value: string) {
  return PRODUCT_CATEGORIES.includes(value as (typeof PRODUCT_CATEGORIES)[number]);
}

function isAllowedProductType(value: string) {
  return PRODUCT_TYPES.includes(value as (typeof PRODUCT_TYPES)[number]);
}

function normalizeImages(value: unknown) {
  let rawImages: unknown = value;
  if (typeof value === "string") {
    try {
      rawImages = JSON.parse(value);
    } catch {
      throw new ProductValidationError("Images must be a valid image list.");
    }
  }

  if (!Array.isArray(rawImages)) return "[]";

  const images = rawImages.slice(0, 5).map((image) => {
    const url = cleanString(image, TEXT_LIMITS.imageUrl);
    if (!url) return "";
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return "";
      return parsed.toString();
    } catch {
      return "";
    }
  }).filter(Boolean);

  return JSON.stringify(images);
}

export function validateProductInput(input: unknown): ProductFormData {
  const body = typeof input === "object" && input !== null ? input as Record<string, unknown> : {};

  const name = cleanString(body.name, TEXT_LIMITS.name);
  if (!name) throw new ProductValidationError("Product name is required.");

  const description = cleanString(body.description, TEXT_LIMITS.description);

  const category = cleanString(body.category, TEXT_LIMITS.spec);
  if (!isAllowedCategory(category)) {
    throw new ProductValidationError("Product category is invalid.");
  }

  const productType = cleanString(body.productType || "Ring", TEXT_LIMITS.spec);
  if (!isAllowedProductType(productType)) {
    throw new ProductValidationError("Product type is invalid.");
  }

  return {
    name,
    description,
    price: parseNonNegativeNumber(body.price, "Price"),
    category,
    productType,
    stoneType: optionalString(body.stoneType),
    metal: optionalString(body.metal),
    caratWeight: optionalString(body.caratWeight),
    cut: optionalString(body.cut),
    color: optionalString(body.color),
    clarity: optionalString(body.clarity),
    certification: optionalString(body.certification),
    dimensions: optionalString(body.dimensions),
    care: optionalString(body.care, TEXT_LIMITS.care),
    stock: parseNonNegativeInteger(body.stock, "Stock"),
    featured: body.featured === true || body.featured === "true",
    images: normalizeImages(body.images),
  };
}
