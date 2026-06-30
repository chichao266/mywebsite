"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { demoSystemSettings, rethrowInProduction } from "@/lib/admin-dev-fallbacks";
import { sanitizeHtml } from "@/lib/sanitize-html";
import { revalidatePath } from "next/cache";

export async function getSettings() {
  try {
    await requireAdmin();
    return await prisma.siteSetting.findMany({
      where: { key: { startsWith: "system_" } },
      orderBy: { key: "asc" },
    });
  } catch (error) {
    rethrowInProduction(error);
    return demoSystemSettings;
  }
}

export async function saveSetting(key: string, title: string, content: string) {
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
  revalidatePath("/admin/settings");
}
