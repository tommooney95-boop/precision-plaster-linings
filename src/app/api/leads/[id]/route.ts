import { isDashboardAuthenticated } from "@/lib/dashboard/auth";
import { markLeadRead, updateLead } from "@/lib/leads/store";
import type { LeadStatus } from "@/lib/leads/types";
import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const VALID_STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "quoted",
  "won",
  "lost",
];

export async function PATCH(request: Request, { params }: RouteParams) {
  if (!(await isDashboardAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    if (body.read === true) {
      const lead = await markLeadRead(id);
      if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json({ lead });
    }

    if (body.status && VALID_STATUSES.includes(body.status)) {
      const lead = await updateLead(id, { status: body.status });
      if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json({ lead });
    }

    return NextResponse.json({ error: "Invalid update" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
