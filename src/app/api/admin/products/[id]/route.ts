import { NextRequest, NextResponse } from "next/server";
import { rethrowInProduction } from "@/lib/admin-dev-fallbacks";
import { prisma } from "@/lib/prisma";

function clean(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const images = Array.isArray(body.images) ? JSON.stringify(body.images) : body.images;
  try {
    const product = await prisma.product.update({
      where: { id },
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
    return NextResponse.json(product);
  } catch (error) {
    rethrowInProduction(error);
    return NextResponse.json(
      { error: "Local preview database is unavailable." },
      { status: 503 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    rethrowInProduction(error);
    return NextResponse.json(
      { error: "Local preview database is unavailable." },
      { status: 503 }
    );
  }
}
