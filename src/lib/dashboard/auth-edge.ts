/** Edge-compatible session verification for middleware */

const SESSION_SECRET_ENV = "SESSION_SECRET";
const PASSWORD_ENV = "DASHBOARD_PASSWORD";

function getSessionSecret(): string {
  const secret = process.env[SESSION_SECRET_ENV] ?? process.env[PASSWORD_ENV];
  if (!secret) {
    if (process.env.NODE_ENV === "production") return "";
    return "dev-only-change-before-production";
  }
  return secret;
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function verifySessionTokenEdge(
  token: string | undefined
): Promise<boolean> {
  if (!token) return false;

  const secret = getSessionSecret();
  if (!secret) return false;

  const [expiresStr, signature] = token.split(".");
  if (!expiresStr || !signature) return false;

  const expires = Number(expiresStr);
  if (isNaN(expires) || Date.now() > expires) return false;

  try {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const sigBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(expiresStr)
    );

    return timingSafeEqualStr(bufferToHex(sigBuffer), signature);
  } catch {
    return false;
  }
}

export const ADMIN_COOKIE = "admin_session";
