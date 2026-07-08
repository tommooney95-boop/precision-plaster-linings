import type { Lead } from "./types";

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function leadsToCsv(leads: Lead[]): string {
  const headers = [
    "ID",
    "Date",
    "Status",
    "Read",
    "Source",
    "Lead Score",
    "Priority",
    "Name",
    "Phone",
    "Email",
    "Suburb",
    "Address",
    "Contact Method",
    "Project Type",
    "Property Type",
    "Budget",
    "Project Size",
    "Square Metres",
    "Urgency",
    "Water Damage",
    "Description",
    "Photos",
    "Review Email Sent",
    "Recommendation",
  ];

  const rows = leads.map((lead) =>
    [
      lead.id,
      new Date(lead.createdAt).toISOString(),
      lead.status,
      lead.read ? "Yes" : "No",
      lead.source,
      String(lead.score.total),
      lead.score.priority,
      lead.contact.fullName,
      lead.contact.phone,
      lead.contact.email,
      lead.contact.suburb ?? "",
      lead.contact.address ?? "",
      lead.contact.contactMethod ?? "",
      lead.project.jobType,
      lead.project.propertyType,
      lead.project.budget ?? "",
      lead.project.projectSize ?? "",
      lead.project.squareMetres != null ? String(lead.project.squareMetres) : "",
      lead.project.urgency ?? "",
      lead.project.waterDamage ? "Yes" : "No",
      lead.project.description ?? "",
      String(lead.photos.length),
      lead.reviewRequestSentAt ?? "",
      lead.score.recommendation,
    ]
      .map(escapeCsv)
      .join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}
