import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, verifySessionTokenEdge } from "@/lib/dashboard/auth-edge";

const PROTECTED_PREFIXES = ["/api/admin", "/api/leads"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!(await verifySessionTokenEdge(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/admin/:path*", "/api/leads/:path*"],
};
