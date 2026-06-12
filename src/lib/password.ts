import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";

const SCRYPT_PREFIX = "scrypt";
const KEY_LENGTH = 64;

function safeEqual(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  return aBuffer.length === bBuffer.length && timingSafeEqual(aBuffer, bBuffer);
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `${SCRYPT_PREFIX}$${salt}$${hash}`;
}

export function needsPasswordRehash(storedPassword: string): boolean {
  return !storedPassword.startsWith(`${SCRYPT_PREFIX}$`);
}

export function verifyPassword(
  password: string,
  storedPassword: string,
  options: { legacySecret?: string; allowPlainTextLegacy?: boolean } = {}
): boolean {
  if (storedPassword.startsWith(`${SCRYPT_PREFIX}$`)) {
    const [, salt, storedHash] = storedPassword.split("$");
    if (!salt || !storedHash) return false;

    const hash = scryptSync(password, salt, KEY_LENGTH).toString("hex");
    return safeEqual(hash, storedHash);
  }

  if (options.legacySecret) {
    const legacyHash = createHmac("sha256", options.legacySecret)
      .update(password)
      .digest("hex");
    if (safeEqual(legacyHash, storedPassword)) return true;
  }

  return options.allowPlainTextLegacy === true && safeEqual(password, storedPassword);
}
