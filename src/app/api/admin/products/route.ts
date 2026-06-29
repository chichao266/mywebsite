import { NextRequest, NextResponse } from "next/server";
import { AdminAuthError, requireAdminRequest } from "@/lib/admin-auth";
import { rethrowInProduction } from "@/lib/admin-dev-fallbacks";
import { getProducts } from "@/lib/product-data";
import { prisma } from "@/lib/prisma";

function clean(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function unauthorized(error: unknown) {
  if (error instanceof AdminAuthError) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET(req: NextRequest) {
  try {
    await requireAdminRequest(req);
  } catch (error) {
    const response = unauthorized(error);
    if (response) return response;
    throw error;
  }
  const products = await getProducts();
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  try {
    await requireAdminRequest(req);
    const body = await req.json();
    const images = Array.isArray(body.images) ? JSON.stringify(body.images) : "[]";
    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: parseFloat(body.price),
        images,
        category: body.category,
        productType: clean(body.productType),
        stoneType: clean(body.stoneType),
        metal: clean(body.metal),
        caratWeight: clean(body.caratWeight),
        cut: clean(body.cut),
        color: clean(body.color),
        clarity: clean(body.clarity),
        certification: clean(body.certification),
        dimensions: clean(body.dimensions),
        care: clean(body.care),
        stock: parseInt(body.stock) || 0,
        featured: body.featured === true || body.featured === "true",
      },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    const response = unauthorized(error);
    if (response) return response;
    rethrowInProduction(error);
    return NextResponse.json(
      { error: "Local preview database is unavailable." },
      { status: 503 }
    );
  }
}
