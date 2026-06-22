const PLACEHOLDER_RE = /^(change-me|replace-with|agatelier-.*-change-me)/i;

function clean(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

export function getRequiredSecret(name: "AUTH_SECRET" | "ADMIN_SECRET"): string {
  const value = clean(process.env[name]);

  if (!value || value.length < 32 || PLACEHOLDER_RE.test(value)) {
    throw new Error(`${name} must be set to a unique 32+ character secret.`);
  }

  return value;
}

export function getOptionalSecret(name: "AUTH_SECRET" | "ADMIN_SECRET"): string | null {
  try {
    return getRequiredSecret(name);
  } catch {
    return null;
  }
}

export function getSiteUrl(): string {
  const configured = clean(process.env.SITE_URL);
  const vercelUrl = clean(process.env.VERCEL_URL);

  const value = configured || (vercelUrl ? `https://${vercelUrl}` : undefined);

  if (!value) {
    throw new Error("SITE_URL must be set to the canonical site URL.");
  }

  const url = new URL(value);
  return url.origin;
}
