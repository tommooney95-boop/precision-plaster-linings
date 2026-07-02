import { siteConfig } from "@/lib/site-config";
import type { LeadScore } from "@/lib/leads/types";
import type { QuoteAssistantAnswers } from "./types";
import { buildQuoteSummary, buildSummaryHtml } from "./summary";
import { PRIORITY_LABELS } from "@/lib/leads/scoring";

interface SendQuoteEmailResult {
  success: boolean;
  method: "resend" | "console";
}

interface SendQuoteEmailOptions {
  answers: QuoteAssistantAnswers;
  photoBuffers?: { filename: string; content: Buffer }[];
  leadScore?: LeadScore;
}

export async function sendQuoteAssistantEmail(
  options: SendQuoteEmailOptions
): Promise<SendQuoteEmailResult> {
  const { answers, photoBuffers = [], leadScore } = options;
  const summary = buildQuoteSummary(answers);
  const scoreBlock = leadScore
    ? `\n\nLEAD SCORE: ${leadScore.total}/100 — ${PRIORITY_LABELS[leadScore.priority]}\n${leadScore.recommendation}\n`
    : "";
  const html = buildSummaryHtml(answers, leadScore);
  const priorityTag = leadScore ? `[${leadScore.priority.toUpperCase()} ${leadScore.total}] ` : "";
  const subject = `${priorityTag}New Quote Request — ${answers.fullName ?? "Website Visitor"} — ${answers.workType ?? "Plastering"}`;

  const resendKey = process.env.RESEND_API_KEY;
  const toEmail =
    process.env.QUOTE_EMAIL_TO ?? siteConfig.contact.email;
  const fromEmail =
    process.env.QUOTE_EMAIL_FROM ?? "quotes@precisionplasterlinings.com.au";

  if (resendKey) {
    const attachments = photoBuffers.map((p) => ({
      filename: p.filename,
      content: p.content.toString("base64"),
    }));

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: answers.email,
        subject,
        text: summary + scoreBlock,
        html,
        attachments: attachments.length > 0 ? attachments : undefined,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Email delivery failed: ${err}`);
    }

    return { success: true, method: "resend" };
  }

  // Development fallback — no fake delivery
  console.log("\n─── QUOTE ASSISTANT SUBMISSION ───");
  console.log(`To: ${toEmail}`);
  console.log(`Subject: ${subject}`);
  console.log(summary + scoreBlock);
  if (photoBuffers.length > 0) {
    console.log(`Attachments: ${photoBuffers.map((p) => p.filename).join(", ")}`);
  }
  console.log("──────────────────────────────────\n");

  return { success: true, method: "console" };
}
