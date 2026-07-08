import { isDashboardAuthenticated } from "@/lib/dashboard/auth";
import {
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

function reviewMessage(reviewEmail: {
  sent: boolean;
  skipped?: string;
  error?: string;
}): string {
  if (reviewEmail.sent) return "Review request email sent to customer.";
  if (reviewEmail.skipped === "already_sent") {
    return "Review request was already sent for this customer.";
  }
  if (reviewEmail.skipped === "no_email") {
    return "No customer email on file — review request not sent.";
  }
  if (reviewEmail.skipped === "no_review_url") {
    return "GOOGLE_REVIEW_URL is not configured — review request not sent.";
  }
  return reviewEmail.error ?? "Review request could not be sent.";
}

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
      const { lead, reviewEmail } = await sendReviewRequestOnly(id);
      if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json({
        lead,
        reviewEmail,
        message: reviewMessage(reviewEmail),
      });
    }

    if (body.status && VALID_STATUSES.includes(body.status)) {
      if (body.status === "completed") {
        const { lead, reviewEmail } = await markJobCompleted(id);
        if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json({
          lead,
          reviewEmail,
          message: reviewMessage(reviewEmail),
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
