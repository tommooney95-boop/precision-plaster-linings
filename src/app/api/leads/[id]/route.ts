import { isDashboardAuthenticated } from "@/lib/dashboard/auth";
import {
  buildReviewChannelsMessage,
  markJobCompleted,
  sendReviewRequestOnly,
} from "@/lib/leads/complete-lead";
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
  "completed",
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

    if (body.sendReviewRequest === true) {
      const { lead, reviewEmail, reviewSms } = await sendReviewRequestOnly(id);
      if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
      const { message, tone } = buildReviewChannelsMessage(reviewEmail, reviewSms);
      return NextResponse.json({
        lead,
        reviewEmail,
        reviewSms,
        message,
        tone,
      });
    }

    if (body.status && VALID_STATUSES.includes(body.status)) {
      if (body.status === "completed") {
        const { lead, reviewEmail, reviewSms } = await markJobCompleted(id);
        if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
        const { message, tone } = buildReviewChannelsMessage(reviewEmail, reviewSms);
        return NextResponse.json({
          lead,
          reviewEmail,
          reviewSms,
          message,
          tone,
        });
      }

      const lead = await updateLead(id, { status: body.status });
      if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json({ lead });
    }

    return NextResponse.json({ error: "Invalid update" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
