import { siteConfig } from "@/lib/site-config";
import type { Lead } from "./types";
import {
  firstName,
  getGoogleReviewUrl,
  reviewEmailSubject,
} from "@/lib/reviews/google-review";

export type ReviewRequestSkipReason =
  | "already_sent"
  | "no_email"
  | "no_review_url";

export interface ReviewRequestResult {
  sent: boolean;
  skipped?: ReviewRequestSkipReason;
  error?: string;
  method?: "resend" | "console";
}

function buildReviewEmailText(lead: Lead, reviewUrl: string): string {
  const name = firstName(lead.contact.fullName);
  return [
    `Hi ${name},`,
    "",
    `Thank you for choosing ${siteConfig.name} for your ${lead.project.jobType.toLowerCase()} project.`,
    "",
    "We hope you're happy with the finished work. If you have a moment, we'd really appreciate a quick Google review — it helps other homeowners and builders in the Albury–Wodonga area find us.",
    "",
    `Leave a review: ${reviewUrl}`,
    "",
    `Or call us anytime: ${siteConfig.contact.phone}`,
    "",
    `Thanks again,`,
    siteConfig.name,
  ].join("\n");
}

function buildReviewEmailHtml(lead: Lead, reviewUrl: string): string {
  const name = firstName(lead.contact.fullName);
  return `<div style="font-family:sans-serif;background:#111;color:#fff;padding:24px;max-width:600px;">
    <div style="text-align:center;margin-bottom:24px;">
      <img src="${siteConfig.url}${siteConfig.brand.logoWhite}" alt="${siteConfig.name}" width="200" style="max-width:200px;height:auto;" />
    </div>
    <p style="color:#ccc;line-height:1.6;">Hi ${name},</p>
    <p style="color:#ccc;line-height:1.6;">
      Thank you for choosing <strong style="color:#fff;">${siteConfig.name}</strong>
      for your ${lead.project.jobType.toLowerCase()} project.
    </p>
    <p style="color:#ccc;line-height:1.6;">
      We hope you're happy with the finished work. If you have a moment, we'd really appreciate
      a quick Google review — it helps other customers in the ${siteConfig.location.regionName} area find us.
    </p>
    <p style="text-align:center;margin:28px 0;">
      <a href="${reviewUrl}" style="display:inline-block;background:#D90429;color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:600;">
        Leave a Google Review
      </a>
    </p>
    <p style="color:#888;font-size:14px;line-height:1.6;text-align:center;">
      Questions? Call <a href="${siteConfig.contact.phoneHref}" style="color:#D90429;">${siteConfig.contact.phone}</a>
    </p>
    <p style="color:#888;font-size:13px;margin-top:32px;border-top:1px solid #2a2a2a;padding-top:16px;">
      ${siteConfig.name} · ${siteConfig.location.regionName}
    </p>
  </div>`;
}

async function sendCustomerEmail(options: {
  to: string;
  subject: string;
  text: string;
  html: string;
}): Promise<{ success: boolean; method: "resend" | "console"; error?: string }> {
  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail =
    process.env.QUOTE_EMAIL_FROM ?? "quotes@precisionplasterlinings.com.au";

  if (resendKey) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [options.to],
        subject: options.subject,
        text: options.text,
        html: options.html,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("Review request email failed:", detail);
      return { success: false, method: "resend", error: "Email delivery failed" };
    }

    return { success: true, method: "resend" };
  }

  console.log("\n─── REVIEW REQUEST EMAIL ───");
  console.log(`To: ${options.to}`);
  console.log(`Subject: ${options.subject}`);
  console.log(options.text);
  console.log("────────────────────────────\n");

  return { success: true, method: "console" };
}

export async function sendReviewRequestEmail(
  lead: Lead
): Promise<ReviewRequestResult> {
  if (lead.reviewRequestSentAt) {
    return { sent: false, skipped: "already_sent" };
  }

  const email = lead.contact.email?.trim();
  if (!email) {
    return { sent: false, skipped: "no_email" };
  }

  const reviewUrl = getGoogleReviewUrl();
  if (!reviewUrl) {
    return { sent: false, skipped: "no_review_url" };
  }

  const result = await sendCustomerEmail({
    to: email,
    subject: reviewEmailSubject(),
    text: buildReviewEmailText(lead, reviewUrl),
    html: buildReviewEmailHtml(lead, reviewUrl),
  });

  if (!result.success) {
    return { sent: false, error: result.error ?? "Email delivery failed" };
  }

  return { sent: true, method: result.method };
}
