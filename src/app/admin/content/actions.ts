"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { demoSiteSettings, rethrowInProduction } from "@/lib/admin-dev-fallbacks";
import { sanitizeHtml } from "@/lib/sanitize-html";
import { revalidatePath } from "next/cache";

export async function getSiteSettings() {
  try {
    await requireAdmin();
    return await prisma.siteSetting.findMany({ orderBy: { key: "asc" } });
  } catch (error) {
    rethrowInProduction(error);
    return demoSiteSettings;
  }
}

export async function saveSiteSetting(key: string, title: string, content: string) {
  try {
    await requireAdmin();
    const safeContent = sanitizeHtml(content);
    await prisma.siteSetting.upsert({
      where: { key },
      update: { title, content: safeContent },
      create: { key, title, content: safeContent },
    });
  } catch (error) {
    rethrowInProduction(error);
  }
  revalidatePath("/admin/content");
}

export async function deleteSiteSetting(key: string) {
  try {
    await requireAdmin();
    await prisma.siteSetting.delete({ where: { key } });
  } catch (error) {
    rethrowInProduction(error);
  }
  revalidatePath("/admin/content");
}
