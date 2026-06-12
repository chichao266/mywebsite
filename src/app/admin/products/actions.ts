"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ProductFormData = {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  featured: boolean;
  images: string;
};

export async function createProduct(data: ProductFormData) {
  await prisma.product.create({ data });
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(id: string, data: ProductFormData) {
  await prisma.product.update({ where: { id }, data });
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
}
