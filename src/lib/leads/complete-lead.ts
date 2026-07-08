import { sendReviewRequestEmail, type ReviewRequestResult } from "./review-request";
import { getLeadById, updateLead } from "./store";
import type { Lead } from "./types";

export interface CompleteLeadResult {
  lead: Lead | null;
  reviewEmail: ReviewRequestResult;
}

/** Mark job completed and send the Google review request email (once per lead). */
export async function markJobCompleted(
  id: string
): Promise<CompleteLeadResult> {
  const existing = await getLeadById(id);
  if (!existing) {
    return { lead: null, reviewEmail: { sent: false, error: "Not found" } };
  }

  let lead = existing;
  if (existing.status !== "completed") {
    const updated = await updateLead(id, { status: "completed" });
    if (!updated) {
      return { lead: null, reviewEmail: { sent: false, error: "Update failed" } };
    }
    lead = updated;
  }

  const reviewEmail = await sendReviewRequestEmail(lead);
  if (reviewEmail.sent) {
    const withTimestamp = await updateLead(id, {
      reviewRequestSentAt: new Date().toISOString(),
    });
    return {
      lead: withTimestamp ?? lead,
      reviewEmail,
    };
  }

  return { lead, reviewEmail };
}

/** Send review request without changing lead status. */
export async function sendReviewRequestOnly(
  id: string
): Promise<CompleteLeadResult> {
  const existing = await getLeadById(id);
  if (!existing) {
    return { lead: null, reviewEmail: { sent: false, error: "Not found" } };
  }

  const reviewEmail = await sendReviewRequestEmail(existing);
  if (reviewEmail.sent) {
    const updated = await updateLead(id, {
      reviewRequestSentAt: new Date().toISOString(),
    });
    return {
      lead: updated ?? existing,
      reviewEmail,
    };
  }

  return { lead: existing, reviewEmail };
}
