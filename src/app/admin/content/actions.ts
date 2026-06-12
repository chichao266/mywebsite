"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSiteSettings() {
  return prisma.siteSetting.findMany({ orderBy: { key: "asc" } });
}

export async function saveSiteSetting(key: string, title: string, content: string) {
  await prisma.siteSetting.upsert({
    where: { key },
    update: { title, content },
    create: { key, title, content },
  });
  revalidatePath("/admin/content");
}

export async function deleteSiteSetting(key: string) {
  await prisma.siteSetting.delete({ where: { key } });
  revalidatePath("/admin/content");
}
