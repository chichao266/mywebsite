"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSettings() {
  return prisma.siteSetting.findMany({
    where: { key: { startsWith: "system_" } },
    orderBy: { key: "asc" },
  });
}

export async function saveSetting(key: string, title: string, content: string) {
  await prisma.siteSetting.upsert({
    where: { key },
    update: { title, content },
    create: { key, title, content },
  });
  revalidatePath("/admin/settings");
}
