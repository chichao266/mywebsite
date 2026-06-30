import { NextRequest, NextResponse } from "next/server";
import { AdminAuthError, requireAdminRequest } from "@/lib/admin-auth";
import { rethrowInProduction } from "@/lib/admin-dev-fallbacks";
import { prisma } from "@/lib/prisma";
import { ProductValidationError, validateProductInput } from "@/lib/product-validation";

function unauthorized(error: unknown) {
  if (error instanceof AdminAuthError) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await requireAdminRequest(req);
    const body = await req.json();
    const data = validateProductInput(body);
    const product = await prisma.product.update({
      where: { id },
      data,
    });
    return NextResponse.json(product);
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await requireAdminRequest(req);
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
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
