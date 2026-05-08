import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Create Product table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Product" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "price" DOUBLE PRECISION NOT NULL,
        "imageUrl" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "stock" INTEGER NOT NULL DEFAULT 0,
        "featured" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL
      )
    `);

    // Create Order table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Order" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "customerName" TEXT NOT NULL,
        "customerEmail" TEXT NOT NULL,
        "address" TEXT NOT NULL,
        "city" TEXT NOT NULL,
        "state" TEXT NOT NULL,
        "zip" TEXT NOT NULL,
        "total" DOUBLE PRECISION NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'pending',
        "stripeSessionId" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL
      )
    `);

    // Create OrderItem table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "OrderItem" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "orderId" TEXT NOT NULL,
        "productId" TEXT NOT NULL,
        "quantity" INTEGER NOT NULL,
        "price" DOUBLE PRECISION NOT NULL,
        CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      )
    `);

    // Insert seed products
    const existingCount = await prisma.product.count();
    if (existingCount === 0) {
      await prisma.product.createMany({
        data: [
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
            description: "Elegant minimalist watch with leather strap.",
            price: 129.99,
            imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
            category: "Accessories",
            stock: 30,
            featured: true,
          },
          {
            name: "Cotton T-Shirt",
            description: "Soft 100% organic cotton t-shirt.",
            price: 24.99,
            imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
            category: "Clothing",
            stock: 100,
            featured: false,
          },
          {
            name: "Stainless Steel Water Bottle",
            description: "Double-wall insulated water bottle.",
            price: 34.99,
            imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80",
            category: "Lifestyle",
            stock: 75,
            featured: true,
          },
          {
            name: "Leather Backpack",
            description: "Handcrafted full-grain leather backpack.",
            price: 149.99,
            imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
            category: "Accessories",
            stock: 20,
            featured: false,
          },
        ],
      });
    }

    const count = await prisma.product.count();
    return NextResponse.json({
      ok: true,
      productCount: count,
      message: "Database initialized successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message || String(error) },
      { status: 500 }
    );
  }
}
