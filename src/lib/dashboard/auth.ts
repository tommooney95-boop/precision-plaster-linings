import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const SESSION_SECRET_ENV = "SESSION_SECRET";
const PASSWORD_ENV = "DASHBOARD_PASSWORD";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

function getSessionSecret(): string {
  const secret = process.env[SESSION_SECRET_ENV] ?? process.env[PASSWORD_ENV];
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "DASHBOARD_PASSWORD or SESSION_SECRET must be set in production"
      );
    }
    return "dev-only-change-before-production";
  }
  return secret;
}

export function getDashboardPassword(): string {
  const password = process.env[PASSWORD_ENV];
  if (!password) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("DASHBOARD_PASSWORD must be set in production");
    }
    return "dev-only-change-before-production";
  }
  return password;
}

export function createSessionToken(): string {
  const expires = Date.now() + SESSION_DURATION_MS;
  const signature = createHmac("sha256", getSessionSecret())
    .update(String(expires))
    .digest("hex");
  return `${expires}.${signature}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;

  const [expiresStr, signature] = token.split(".");
  if (!expiresStr || !signature) return false;

  const expires = Number(expiresStr);
  if (isNaN(expires) || Date.now() > expires) return false;

  try {
    const expected = createHmac("sha256", getSessionSecret())
      .update(expiresStr)
      .digest("hex");

    const sigBuffer = Buffer.from(signature, "hex");
    const expectedBuffer = Buffer.from(expected, "hex");

    if (sigBuffer.length !== expectedBuffer.length) return false;
    return timingSafeEqual(sigBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

export const ADMIN_COOKIE = "admin_session";

export function createAuthCookie(token: string) {
  return {
    name: ADMIN_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: SESSION_DURATION_MS / 1000,
    path: "/",
  };
}

export function clearAuthCookie() {
  return {
    name: ADMIN_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 0,
    path: "/",
  };
}

export async function verifyDashboardPassword(
  password: string
): Promise<boolean> {
  const expected = getDashboardPassword();
  try {
    const a = Buffer.from(password);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function isDashboardAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(ADMIN_COOKIE)?.value);
}
