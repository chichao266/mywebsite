import { NextRequest, NextResponse } from "next/server";
import { AdminAuthError, requireAdminRequest } from "@/lib/admin-auth";
import { rethrowInProduction } from "@/lib/admin-dev-fallbacks";
import { getProducts } from "@/lib/product-data";
import { prisma } from "@/lib/prisma";
import { ProductValidationError, validateProductInput } from "@/lib/product-validation";

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
    const data = validateProductInput(body);
    const product = await prisma.product.create({
      data,
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    const response = unauthorized(error);
    if (response) return response;
    if (error instanceof ProductValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    rethrowInProduction(error);
    return NextResponse.json(
      { error: "Local preview database is unavailable." },
      { status: 503 }
    );
  }
}
