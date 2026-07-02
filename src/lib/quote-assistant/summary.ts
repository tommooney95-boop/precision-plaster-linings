import type { QuoteAssistantAnswers } from "./types";

interface SummarySection {
  title: string;
  items: { label: string; value: string }[];
}

function line(label: string, value?: string): { label: string; value: string } | null {
  if (!value) return null;
  return { label, value };
}

export function buildQuoteSummary(answers: QuoteAssistantAnswers): string {
  const sections = buildSummarySections(answers);
  const lines: string[] = [
    "QUOTE REQUEST — PRECISION PLASTER LININGS",
    "═".repeat(44),
    "",
  ];

  for (const section of sections) {
    lines.push(section.title.toUpperCase());
    lines.push("-".repeat(section.title.length));
    for (const item of section.items) {
      lines.push(`  ${item.label}: ${item.value}`);
    }
    lines.push("");
  }

  lines.push("Submitted via Quote Assistant on the website.");
  return lines.join("\n");
}

export function buildSummarySections(
  answers: QuoteAssistantAnswers
): SummarySection[] {
  const projectItems = [
    line("Work type", answers.workType),
    line("Patch / hole size", answers.holeSize),
    line("Property type", answers.propertyType),
    line("Project category", answers.projectCategory),
    line("Surfaces", answers.surfaces),
    line("Approx. area", answers.squareMetres ? `${answers.squareMetres} m²` : undefined),
    line("Water damage", answers.waterDamage),
    line("Water damage details", answers.waterDamageDetails),
    line("Preferred completion", answers.completionTimeline),
    line(
      "Photos",
      answers.photos?.length
        ? `${answers.photos.length} file(s) attached`
        : "None uploaded"
    ),
  ].filter(Boolean) as { label: string; value: string }[];

  const commercialItems = [
    line("Business / site name", answers.commercialBusinessName),
    line("Floors involved", answers.commercialFloorCount),
    line("Site access", answers.commercialAccess),
  ].filter(Boolean) as { label: string; value: string }[];

  const contactItems = [
    line("Name", answers.fullName),
    line("Phone", answers.phone),
    line("Email", answers.email),
    line("Suburb", answers.suburb),
  ].filter(Boolean) as { label: string; value: string }[];

  const sections: SummarySection[] = [
    { title: "Project Details", items: projectItems },
  ];

  if (commercialItems.length > 0) {
    sections.push({ title: "Commercial Details", items: commercialItems });
  }

  sections.push({ title: "Contact Information", items: contactItems });

  return sections;
}

import type { LeadScore } from "@/lib/leads/types";

export function buildSummaryHtml(
  answers: QuoteAssistantAnswers,
  leadScore?: LeadScore
): string {
  const sections = buildSummarySections(answers);
  const sectionHtml = sections
    .map(
      (s) => `
    <h2 style="color:#D90429;font-size:14px;text-transform:uppercase;letter-spacing:1px;margin:24px 0 8px;">${s.title}</h2>
    <table style="width:100%;border-collapse:collapse;">
      ${s.items
        .map(
          (item) => `
        <tr>
          <td style="padding:6px 12px 6px 0;color:#666;width:40%;vertical-align:top;">${item.label}</td>
          <td style="padding:6px 0;color:#111;font-weight:500;">${item.value}</td>
        </tr>`
        )
        .join("")}
    </table>`
    )
    .join("");

  const scoreHtml = leadScore
    ? `<div style="background:#D90429;color:#fff;padding:16px;border-radius:8px;margin-bottom:24px;">
        <p style="margin:0;font-size:12px;text-transform:uppercase;letter-spacing:1px;opacity:0.8;">Lead Score</p>
        <p style="margin:4px 0 0;font-size:28px;font-weight:800;">${leadScore.total}/100</p>
        <p style="margin:4px 0 0;font-size:14px;">${leadScore.priority.toUpperCase()} — ${leadScore.recommendation}</p>
      </div>`
    : "";

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#333;">
  <div style="background:#111;padding:24px;border-radius:12px 12px 0 0;">
    <h1 style="color:#fff;margin:0;font-size:20px;">New Quote Request</h1>
    <p style="color:#999;margin:8px 0 0;font-size:14px;">Precision Plaster Linings — Quote Assistant</p>
  </div>
  <div style="border:1px solid #eee;border-top:none;padding:24px;border-radius:0 0 12px 12px;">
    ${scoreHtml}
    ${sectionHtml}
    <p style="margin-top:32px;padding-top:16px;border-top:1px solid #eee;font-size:12px;color:#999;">
      Submitted via the website Quote Assistant.
    </p>
  </div>
</body>
</html>`;
}
