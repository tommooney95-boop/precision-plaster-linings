/**
 * Twilio SMS helpers. Configure in Vercel:
 * TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER
 */

export function isSmsConfigured(): boolean {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID?.trim() &&
      process.env.TWILIO_AUTH_TOKEN?.trim() &&
      process.env.TWILIO_FROM_NUMBER?.trim()
  );
}

/** Normalise AU / international numbers to E.164 (+61…). */
export function normalizePhoneToE164(raw: string): string | null {
  const digits = raw.replace(/[^\d+]/g, "").trim();
  if (!digits) return null;

  let normalized = digits;
  if (normalized.startsWith("00")) {
    normalized = `+${normalized.slice(2)}`;
  }
  if (normalized.startsWith("0") && !normalized.startsWith("+")) {
    // Australian mobile / landline → +61
    normalized = `+61${normalized.slice(1)}`;
  } else if (/^61\d{8,}$/.test(normalized)) {
    normalized = `+${normalized}`;
  } else if (!normalized.startsWith("+") && /^\d{10,15}$/.test(normalized)) {
    normalized = `+${normalized}`;
  }

  if (!/^\+[1-9]\d{7,14}$/.test(normalized)) {
    return null;
  }

  return normalized;
}

export interface SendSmsResult {
  success: boolean;
  method: "twilio" | "console";
  error?: string;
  sid?: string;
}

export async function sendSms(
  toRaw: string,
  body: string
): Promise<SendSmsResult> {
  const to = normalizePhoneToE164(toRaw);
  if (!to) {
    return { success: false, method: "twilio", error: "Invalid phone number" };
  }

  const sid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const token = process.env.TWILIO_AUTH_TOKEN?.trim();
  const from = process.env.TWILIO_FROM_NUMBER?.trim();

  if (!sid || !token || !from) {
    console.log("\n─── SMS (console fallback — Twilio not configured) ───");
    console.log(`To: ${to}`);
    console.log(body);
    console.log("─────────────────────────────────────────────────────\n");
    return { success: true, method: "console" };
  }

  const auth = Buffer.from(`${sid}:${token}`).toString("base64");
  const params = new URLSearchParams({ To: to, From: from, Body: body });

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    }
  );

  if (!response.ok) {
    const detail = await response.text();
    console.error("Twilio SMS failed:", detail);
    return { success: false, method: "twilio", error: "SMS delivery failed" };
  }

  const data = (await response.json()) as { sid?: string };
  return { success: true, method: "twilio", sid: data.sid };
}
