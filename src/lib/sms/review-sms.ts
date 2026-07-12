import { firstName, getGoogleReviewUrl } from "@/lib/reviews/google-review";
import { siteConfig } from "@/lib/site-config";
import type { Lead } from "@/lib/leads/types";
import { isSmsConfigured, sendSms, type SendSmsResult } from "./twilio";

export type ReviewSmsSkipReason =
  | "already_sent"
  | "no_phone"
  | "no_review_url"
  | "sms_not_configured";

export interface ReviewSmsResult {
  sent: boolean;
  skipped?: ReviewSmsSkipReason;
  error?: string;
  method?: SendSmsResult["method"];
}

export function buildReviewSmsBody(lead: Lead, reviewUrl: string): string {
  const name = firstName(lead.contact.fullName);
  return [
    `Hi ${name}, thanks for choosing ${siteConfig.name}.`,
    `If you're happy with the work, a quick Google review helps a lot:`,
    reviewUrl,
    `Call ${siteConfig.contact.phone} anytime.`,
  ].join(" ");
}

export async function sendReviewRequestSms(
  lead: Lead,
  options?: { requireConfigured?: boolean }
): Promise<ReviewSmsResult> {
  if (lead.reviewRequestSentAt) {
    return { sent: false, skipped: "already_sent" };
  }

  const phone = lead.contact.phone?.trim();
  if (!phone) {
    return { sent: false, skipped: "no_phone" };
  }

  const reviewUrl = getGoogleReviewUrl();
  if (!reviewUrl) {
    return { sent: false, skipped: "no_review_url" };
  }

  if (options?.requireConfigured && !isSmsConfigured()) {
    return { sent: false, skipped: "sms_not_configured" };
  }

  const result = await sendSms(phone, buildReviewSmsBody(lead, reviewUrl));
  if (!result.success) {
    return { sent: false, error: result.error ?? "SMS delivery failed" };
  }

  return { sent: true, method: result.method };
}
