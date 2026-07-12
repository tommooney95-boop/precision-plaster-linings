import {
  sendReviewRequestEmail,
  type ReviewRequestResult,
} from "./review-request";
import {
  sendReviewRequestSms,
  type ReviewSmsResult,
} from "@/lib/sms/review-sms";
import { isSmsConfigured } from "@/lib/sms/twilio";
import { getLeadById, updateLead } from "./store";
import type { Lead } from "./types";

export interface CompleteLeadResult {
  lead: Lead | null;
  reviewEmail: ReviewRequestResult;
  reviewSms: ReviewSmsResult;
}

function emptySmsSkip(skipped: ReviewSmsResult["skipped"]): ReviewSmsResult {
  return { sent: false, skipped };
}

async function sendReviewChannels(lead: Lead): Promise<{
  reviewEmail: ReviewRequestResult;
  reviewSms: ReviewSmsResult;
}> {
  if (lead.reviewRequestSentAt) {
    return {
      reviewEmail: { sent: false, skipped: "already_sent" },
      reviewSms: emptySmsSkip("already_sent"),
    };
  }

  const [reviewEmail, reviewSms] = await Promise.all([
    sendReviewRequestEmail(lead),
    // Only attempt SMS when Twilio is configured (avoid noisy console SMS in prod without Twilio)
    isSmsConfigured()
      ? sendReviewRequestSms(lead, { requireConfigured: true })
      : Promise.resolve(emptySmsSkip("sms_not_configured")),
  ]);

  return { reviewEmail, reviewSms };
}

/** Mark job completed and send Google review request (email + SMS when configured). */
export async function markJobCompleted(
  id: string
): Promise<CompleteLeadResult> {
  const existing = await getLeadById(id);
  if (!existing) {
    return {
      lead: null,
      reviewEmail: { sent: false, error: "Not found" },
      reviewSms: { sent: false, error: "Not found" },
    };
  }

  let lead = existing;
  if (existing.status !== "completed") {
    const updated = await updateLead(id, { status: "completed" });
    if (!updated) {
      return {
        lead: null,
        reviewEmail: { sent: false, error: "Update failed" },
        reviewSms: { sent: false, error: "Update failed" },
      };
    }
    lead = updated;
  }

  const { reviewEmail, reviewSms } = await sendReviewChannels(lead);
  if (reviewEmail.sent || reviewSms.sent) {
    const withTimestamp = await updateLead(id, {
      reviewRequestSentAt: new Date().toISOString(),
    });
    return {
      lead: withTimestamp ?? lead,
      reviewEmail,
      reviewSms,
    };
  }

  return { lead, reviewEmail, reviewSms };
}

/** Send review request without changing lead status. */
export async function sendReviewRequestOnly(
  id: string
): Promise<CompleteLeadResult> {
  const existing = await getLeadById(id);
  if (!existing) {
    return {
      lead: null,
      reviewEmail: { sent: false, error: "Not found" },
      reviewSms: { sent: false, error: "Not found" },
    };
  }

  const { reviewEmail, reviewSms } = await sendReviewChannels(existing);
  if (reviewEmail.sent || reviewSms.sent) {
    const updated = await updateLead(id, {
      reviewRequestSentAt: new Date().toISOString(),
    });
    return {
      lead: updated ?? existing,
      reviewEmail,
      reviewSms,
    };
  }

  return { lead: existing, reviewEmail, reviewSms };
}

export function buildReviewChannelsMessage(
  reviewEmail: ReviewRequestResult,
  reviewSms: ReviewSmsResult
): { message: string; tone: "success" | "warning" | "error" } {
  const parts: string[] = [];

  if (reviewEmail.sent) parts.push("email sent");
  else if (reviewEmail.skipped === "already_sent") {
    return {
      message: "Review request was already sent for this customer.",
      tone: "warning",
    };
  } else if (reviewEmail.skipped === "no_email") {
    parts.push("no email on file");
  } else if (reviewEmail.skipped === "no_review_url") {
    return {
      message: "GOOGLE_REVIEW_URL is not configured — review request not sent.",
      tone: "error",
    };
  } else if (reviewEmail.error) {
    parts.push(`email failed (${reviewEmail.error})`);
  }

  if (reviewSms.sent) parts.push("SMS sent");
  else if (reviewSms.skipped === "sms_not_configured") {
    // Don't alarm — SMS is optional until Twilio is set up
  } else if (reviewSms.skipped === "no_phone") {
    parts.push("no phone on file for SMS");
  } else if (reviewSms.error) {
    parts.push(`SMS failed (${reviewSms.error})`);
  }

  if (reviewEmail.sent || reviewSms.sent) {
    return {
      message: `Review request: ${parts.join("; ")}.`,
      tone: "success",
    };
  }

  return {
    message:
      parts.length > 0
        ? `Review request not sent: ${parts.join("; ")}.`
        : "Review request could not be sent.",
    tone: "error",
  };
}
