import type { Lead } from "@/lib/leads/types";
import { PRIORITY_LABELS } from "@/lib/leads/scoring";
import { siteConfig } from "@/lib/site-config";
import { isSmsConfigured, sendSms } from "./twilio";

/** Optional SMS to the business owner when a new enquiry arrives. */
export async function sendOwnerLeadAlertSms(lead: Lead): Promise<void> {
  const ownerPhone = process.env.OWNER_SMS_TO?.trim();
  if (!ownerPhone || !isSmsConfigured()) return;

  const suburb = lead.contact.suburb ? ` · ${lead.contact.suburb}` : "";
  const body = [
    `New ${PRIORITY_LABELS[lead.score.priority]} lead (${lead.score.total}/100)`,
    `${lead.contact.fullName}${suburb}`,
    lead.project.jobType,
    lead.contact.phone,
    `${siteConfig.url}/admin`,
  ].join(" — ");

  const result = await sendSms(ownerPhone, body);
  if (!result.success) {
    console.error("Owner lead alert SMS failed:", result.error);
  }
}
