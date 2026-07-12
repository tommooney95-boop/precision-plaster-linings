import { isDashboardAuthenticated } from "@/lib/dashboard/auth";
import {
  filterLeads,
  getLeadStats,
  getLeads,
  getProjectTypes,
} from "@/lib/leads/store";
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

    const [allLeads, stats, projectTypes] = await Promise.all([
      getLeads(),
      getLeadStats(),
      getProjectTypes(),
    ]);

    const leads = filterLeads(allLeads, filters);

    return NextResponse.json({
      leads,
      stats,
      projectTypes,
      filters,
      total: allLeads.length,
      filteredCount: leads.length,
    });
  } catch {
    return NextResponse.json({ error: "Failed to load leads" }, { status: 500 });
  }
}
