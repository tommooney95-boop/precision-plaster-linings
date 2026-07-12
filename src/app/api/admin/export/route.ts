import { isDashboardAuthenticated } from "@/lib/dashboard/auth";
import { leadsToCsv } from "@/lib/leads/export";
import { filterLeads, getLeads } from "@/lib/leads/store";
import type { LeadFilters, LeadPriority, LeadSource, LeadStatus } from "@/lib/leads/types";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  if (!(await isDashboardAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);

    const filters: LeadFilters = {
      search: searchParams.get("search") ?? undefined,
      priority: (searchParams.get("priority") as LeadPriority | "all") ?? "all",
      status: (searchParams.get("status") as LeadStatus | "all") ?? "all",
      source: (searchParams.get("source") as LeadSource | "all") ?? "all",
      projectType: searchParams.get("projectType") ?? "all",
      unreadOnly: searchParams.get("unread") === "true",
      newTodayOnly: searchParams.get("today") === "true",
    };

    const leads = filterLeads(await getLeads(), filters);
    const csv = leadsToCsv(leads);
    const date = new Date().toISOString().slice(0, 10);

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="enquiries-${date}.csv"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
