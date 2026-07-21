// src/lib/auth/session.ts
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const SESSION_COOKIE_NAME = "admin_session";
// Session duration: 12 hours in seconds & milliseconds
const SESSION_MAX_AGE_SECONDS = 12 * 60 * 60; // 12 hours
const SESSION_MAX_AGE_MS = SESSION_MAX_AGE_SECONDS * 1000;

// [SEC] Require a real secret — never fall back to a default in any environment.
const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET || SESSION_SECRET.length < 32) {
  throw new Error(
    "[auth] SESSION_SECRET environment variable is missing or too short (min 32 chars). " +
    "Set it in .env.local before running the app."
  );
}

/**
 * Generates a HMAC-SHA256 signature for a given payload.
 * We store the format: `payload.hex(signature)` in the cookie.
 */
function signPayload(payload: string): string {
  const sig = createHmac("sha256", SESSION_SECRET!)
    .update(payload)
    .digest("hex");
  return `${payload}.${sig}`;
}

/**
 * Verifies the cookie value was signed by us using constant-time comparison.
 * Returns the original payload if valid, null otherwise.
 */
function verifyPayload(cookieValue: string): string | null {
  const lastDot = cookieValue.lastIndexOf(".");
  if (lastDot === -1) return null;
  const payload = cookieValue.slice(0, lastDot);
  const providedSig = cookieValue.slice(lastDot + 1);
  const expectedSig = createHmac("sha256", SESSION_SECRET!)
    .update(payload)
    .digest("hex");

  // Constant-time comparison to prevent timing attacks
  try {
    const a = Buffer.from(providedSig, "hex");
    const b = Buffer.from(expectedSig, "hex");
    if (a.length !== b.length) return null;
    if (!timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }

  return payload;
}

export async function createSession() {
  const cookieStore = await cookies();
  // Payload: authenticated + timestamp of creation
  const payload = `authenticated:${Date.now()}`;
  const signed = signPayload(payload);

  cookieStore.set(SESSION_COOKIE_NAME, signed, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Validates session signature AND enforces server-side expiration.
 * Returns true if session is valid and active, false if expired or invalid.
 */
export async function checkSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE_NAME);
  if (!cookie?.value) return false;

  const payload = verifyPayload(cookie.value);
  if (!payload || !payload.startsWith("authenticated:")) return false;

  // Extract creation timestamp and check server-side expiration
  const parts = payload.split(":");
  const createdAt = Number(parts[1]);

  if (isNaN(createdAt)) return false;

  const age = Date.now() - createdAt;
  if (age > SESSION_MAX_AGE_MS || age < 0) {
    // Session expired on server-side — delete expired cookie
    try {
      cookieStore.delete(SESSION_COOKIE_NAME);
    } catch {
      // Ignore if called in context where cookie deletion is restricted
    }
    return false;
  }

  return true;
}
