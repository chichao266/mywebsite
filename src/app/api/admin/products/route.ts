import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const images = Array.isArray(body.images) ? JSON.stringify(body.images) : "[]";
  const product = await prisma.product.create({
    data: {
      name: body.name,
      description: body.description,
      price: parseFloat(body.price),
      images,
      category: body.category,
      stock: parseInt(body.stock) || 0,
      featured: body.featured === true || body.featured === "true",
    },
  });
  return NextResponse.json(product, { status: 201 });
}
