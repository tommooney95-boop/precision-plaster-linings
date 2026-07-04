import { siteConfig } from "@/lib/site-config";
import type { QuoteFormData } from "@/data/quote-form";
import type { Lead, LeadScore } from "./types";
import { PRIORITY_LABELS } from "./scoring";

interface SendEmailResult {
  success: boolean;
  method: "resend" | "console";
}

interface EmailAttachment {
  filename: string;
  content: Buffer;
}

function scoreBlock(leadScore?: LeadScore): string {
  if (!leadScore) return "";
  return `\n\nLEAD SCORE: ${leadScore.total}/100 — ${PRIORITY_LABELS[leadScore.priority]}\n${leadScore.recommendation}\n`;
}

function buildQuoteFormSummary(data: QuoteFormData): string {
  const lines = [
    "QUOTE REQUEST — PRECISION PLASTER LININGS",
    "═".repeat(44),
    "",
    "CONTACT",
    "-------",
    `  Name: ${data.fullName}`,
    `  Phone: ${data.phone}`,
    `  Email: ${data.email}`,
    `  Suburb: ${data.suburb}`,
    data.address ? `  Address: ${data.address}` : null,
    `  Preferred contact: ${data.contactMethod}`,
    "",
    "PROJECT",
    "-------",
    `  Job type: ${data.jobType}`,
    `  Project size: ${data.projectSize}`,
    `  Budget: ${data.budget}`,
    data.startDate ? `  Preferred start: ${data.startDate}` : null,
    "",
    "DESCRIPTION",
    "-----------",
    data.description,
    "",
    "Submitted via website quote form.",
  ].filter((line) => line !== null);

  return lines.join("\n");
}

function buildQuoteFormHtml(data: QuoteFormData, leadScore?: LeadScore): string {
  const rows = [
    ["Name", data.fullName],
    ["Phone", data.phone],
    ["Email", data.email],
    ["Suburb", data.suburb],
    data.address ? ["Address", data.address] : null,
    ["Contact method", data.contactMethod],
    ["Job type", data.jobType],
    ["Project size", data.projectSize],
    ["Budget", data.budget],
    data.startDate ? ["Preferred start", data.startDate] : null,
  ].filter(Boolean) as [string, string][];

  const tableRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px;color:#888;">${label}</td><td style="padding:6px 12px;color:#fff;">${value}</td></tr>`
    )
    .join("");

  const scoreHtml = leadScore
    ? `<p style="margin-top:16px;padding:12px;background:#1a1a1a;border-left:3px solid #D90429;color:#fff;"><strong>Lead score:</strong> ${leadScore.total}/100 — ${PRIORITY_LABELS[leadScore.priority]}<br>${leadScore.recommendation}</p>`
    : "";

  return `<div style="font-family:sans-serif;background:#111;color:#fff;padding:24px;">
    <div style="text-align:center;margin-bottom:24px;">
      <img src="${siteConfig.url}${siteConfig.brand.logoReversed}" alt="${siteConfig.name}" width="220" style="max-width:220px;height:auto;" />
    </div>
    <h2 style="color:#D90429;text-align:center;">New Quote Request</h2>
    <table style="border-collapse:collapse;width:100%;max-width:600px;">${tableRows}</table>
    <h3 style="margin-top:20px;color:#fff;">Description</h3>
    <p style="color:#ccc;white-space:pre-wrap;">${data.description}</p>
    ${scoreHtml}
  </div>`;
}

async function sendViaResend(options: {
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
  attachments?: EmailAttachment[];
}): Promise<SendEmailResult> {
  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.QUOTE_EMAIL_TO ?? siteConfig.contact.email;
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
        to: [toEmail],
        reply_to: options.replyTo,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachments?.length
          ? options.attachments.map((p) => ({
              filename: p.filename,
              content: p.content.toString("base64"),
            }))
          : undefined,
      }),
    });

    if (!response.ok) {
      console.error("Email delivery failed:", await response.text());
      throw new Error("Email delivery failed");
    }

    return { success: true, method: "resend" };
  }

  console.log("\n─── QUOTE SUBMISSION ───");
  console.log(`To: ${toEmail}`);
  console.log(`Subject: ${options.subject}`);
  console.log(options.text);
  if (options.attachments?.length) {
    console.log(
      `Attachments: ${options.attachments.map((p) => p.filename).join(", ")}`
    );
  }
  console.log("────────────────────────\n");

  return { success: true, method: "console" };
}

export async function sendQuoteFormEmail(
  data: QuoteFormData,
  leadScore?: LeadScore,
  photoBuffers: EmailAttachment[] = []
): Promise<SendEmailResult> {
  const summary = buildQuoteFormSummary(data);
  const html = buildQuoteFormHtml(data, leadScore);
  const priorityTag = leadScore
    ? `[${leadScore.priority.toUpperCase()} ${leadScore.total}] `
    : "";
  const subject = `${priorityTag}New Quote Request — ${data.fullName} — ${data.jobType}`;

  return sendViaResend({
    subject,
    text: summary + scoreBlock(leadScore),
    html,
    replyTo: data.email,
    attachments: photoBuffers,
  });
}

export async function sendLeadNotificationEmail(
  lead: Lead,
  summaryText: string,
  summaryHtml: string,
  photoBuffers: EmailAttachment[] = []
): Promise<SendEmailResult> {
  const priorityTag = `[${lead.score.priority.toUpperCase()} ${lead.score.total}] `;
  const subject = `${priorityTag}New Quote Request — ${lead.contact.fullName} — ${lead.project.jobType}`;

  return sendViaResend({
    subject,
    text: summaryText + scoreBlock(lead.score),
    html: summaryHtml,
    replyTo: lead.contact.email,
    attachments: photoBuffers,
  });
}
