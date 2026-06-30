"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { rethrowInProduction } from "@/lib/admin-dev-fallbacks";
import { ProductValidationError, validateProductInput, type ProductFormData } from "@/lib/product-validation";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(data: ProductFormData) {
  try {
    await requireAdmin();
    await prisma.product.create({ data: validateProductInput(data) });
  } catch (error) {
    if (error instanceof ProductValidationError) throw error;
    rethrowInProduction(error);
  }
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(id: string, data: ProductFormData) {
  try {
    await requireAdmin();
    await prisma.product.update({ where: { id }, data: validateProductInput(data) });
  } catch (error) {
    if (error instanceof ProductValidationError) throw error;
    rethrowInProduction(error);
  }
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  try {
    await requireAdmin();
    await prisma.product.delete({ where: { id } });
  } catch (error) {
    rethrowInProduction(error);
  }
  revalidatePath("/admin/products");
}
