import { getRequiredSecret } from "@/lib/env";

const USER_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

type UserTokenPayload = {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
};

function hexToBytes(hex: string): Uint8Array | null {
  if (!/^[0-9a-f]+$/i.test(hex) || hex.length % 2 !== 0) return null;

  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

async function getSigningKey(secret: string, usage: "sign" | "verify") {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    [usage]
  );
}

function parsePayload(payload: string): UserTokenPayload | null {
  try {
    const data = JSON.parse(payload) as Partial<UserTokenPayload>;
    if (
      typeof data.userId !== "string" ||
      typeof data.email !== "string" ||
      typeof data.role !== "string" ||
      typeof data.iat !== "number" ||
      typeof data.exp !== "number" ||
      data.exp <= Date.now()
    ) {
      return null;
    }
    return data as UserTokenPayload;
  } catch {
    return null;
  }
}

export async function createUserToken(user: { id: string; email: string; role: string }) {
  const now = Date.now();
  const payload = JSON.stringify({
    userId: user.id,
    email: user.email,
    role: user.role,
    iat: now,
    exp: now + USER_TOKEN_TTL_MS,
  } satisfies UserTokenPayload);

  const secret = getRequiredSecret("AUTH_SECRET");
  const encoder = new TextEncoder();
  const key = await getSigningKey(secret, "sign");
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const sigHex = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${payload}:${sigHex}`;
}

export async function verifyUserToken(token: string): Promise<UserTokenPayload | null> {
  try {
    const secret = getRequiredSecret("AUTH_SECRET");
    const lastColon = token.lastIndexOf(":");
    if (lastColon === -1) return null;

    const payload = token.substring(0, lastColon);
    const signatureHex = token.substring(lastColon + 1);
    if (!payload || !signatureHex) return null;

    const signature = hexToBytes(signatureHex);
    if (!signature) return null;

    const encoder = new TextEncoder();
    const key = await getSigningKey(secret, "verify");
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      signature as BufferSource,
      encoder.encode(payload)
    );
    if (!valid) return null;

    return parsePayload(payload);
  } catch {
    return null;
  }
}
