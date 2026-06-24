"use server";

import { prisma } from "@/lib/prisma";
import { demoSiteSettings, rethrowInProduction } from "@/lib/admin-dev-fallbacks";
import { revalidatePath } from "next/cache";

export async function getSiteSettings() {
  try {
    return await prisma.siteSetting.findMany({ orderBy: { key: "asc" } });
  } catch (error) {
    rethrowInProduction(error);
    return demoSiteSettings;
  }
}

export async function saveSiteSetting(key: string, title: string, content: string) {
  try {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { title, content },
      create: { key, title, content },
    });
  } catch (error) {
    rethrowInProduction(error);
  }
  revalidatePath("/admin/content");
}

export async function deleteSiteSetting(key: string) {
  try {
    await prisma.siteSetting.delete({ where: { key } });
  } catch (error) {
    rethrowInProduction(error);
  }
  revalidatePath("/admin/content");
}
