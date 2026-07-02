import {

  clearAuthCookie,

  createAuthCookie,

  createSessionToken,

  isDashboardAuthenticated,

  verifyDashboardPassword,

} from "@/lib/dashboard/auth";

import { getClientIp, rateLimit } from "@/lib/security/rate-limit";

import { cookies } from "next/headers";

import { NextResponse } from "next/server";



export async function POST(request: Request) {

  try {

    const ip = getClientIp(request);

    const limit = rateLimit(`auth:${ip}`, 10, 15 * 60 * 1000);

    if (!limit.allowed) {

      return NextResponse.json(

        { error: "Too many login attempts. Please try again later." },

        { status: 429, headers: { "Retry-After": String(Math.ceil(limit.retryAfterMs / 1000)) } }

      );

    }



    const { password } = await request.json();



    if (!password || !(await verifyDashboardPassword(password))) {

      return NextResponse.json({ error: "Invalid password" }, { status: 401 });

    }



    const token = createSessionToken();

    const cookieStore = await cookies();

    cookieStore.set(createAuthCookie(token));



    return NextResponse.json({ success: true });

  } catch {

    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });

  }

}



export async function DELETE() {

  const cookieStore = await cookies();

  cookieStore.set(clearAuthCookie());

  return NextResponse.json({ success: true });

}



export async function GET() {

  const authenticated = await isDashboardAuthenticated();

  return NextResponse.json({ authenticated });

}


