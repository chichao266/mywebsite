"use server";

import { prisma } from "@/lib/prisma";
import { rethrowInProduction } from "@/lib/admin-dev-fallbacks";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

export async function createProduct(data: ProductFormData) {
  try {
    await prisma.product.create({ data });
  } catch (error) {
    rethrowInProduction(error);
  }
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(id: string, data: ProductFormData) {
  try {
    await prisma.product.update({ where: { id }, data });
  } catch (error) {
    rethrowInProduction(error);
  }
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({ where: { id } });
  } catch (error) {
    rethrowInProduction(error);
  }
  revalidatePath("/admin/products");
}
