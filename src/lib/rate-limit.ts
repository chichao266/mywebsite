import { prisma } from "@/lib/prisma";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitOptions = {
  limit: number;
  windowMs: number;
};

type RateLimitResult = {
  success: boolean;
  retryAfter: number;
};

const globalForRateLimit = globalThis as unknown as {
  rateLimitStore?: Map<string, RateLimitEntry>;
};

const store = globalForRateLimit.rateLimitStore ?? new Map<string, RateLimitEntry>();
globalForRateLimit.rateLimitStore = store;

export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}

export function rateLimit(
  key: string,
  options: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + options.windowMs });
    return { success: true, retryAfter: 0 };
  }

  existing.count += 1;
  const retryAfter = Math.ceil((existing.resetAt - now) / 1000);
  return { success: existing.count <= options.limit, retryAfter };
}

async function databaseRateLimit(
  key: string,
  options: RateLimitOptions
): Promise<RateLimitResult> {
  const now = Date.now();
  const resetAt = new Date(now + options.windowMs);
  const existing = await prisma.rateLimitBucket.findUnique({ where: { key } });

  if (!existing || existing.resetAt.getTime() <= now) {
    await prisma.rateLimitBucket.upsert({
      where: { key },
      update: { count: 1, resetAt },
      create: { key, count: 1, resetAt },
    });
    return { success: true, retryAfter: 0 };
  }

  const updated = await prisma.rateLimitBucket.update({
    where: { key },
    data: { count: { increment: 1 } },
  });

  const retryAfter = Math.ceil((existing.resetAt.getTime() - now) / 1000);
  return { success: updated.count <= options.limit, retryAfter };
}

export async function sharedRateLimit(
  key: string,
  options: RateLimitOptions
): Promise<RateLimitResult> {
  try {
    return await databaseRateLimit(key, options);
  } catch {
    return rateLimit(key, options);
  }
}
