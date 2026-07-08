import { siteConfig } from "@/lib/site-config";

/** Google "Write a review" link — set GOOGLE_REVIEW_URL in env / Vercel. */
export function getGoogleReviewUrl(): string | null {
  const url = process.env.GOOGLE_REVIEW_URL?.trim();
  return url || null;
}

export function isGoogleReviewConfigured(): boolean {
  return !!getGoogleReviewUrl();
}

export function getGoogleReviewSetupHint(): string {
  return `Add GOOGLE_REVIEW_URL to your environment (Google Business Profile → Get more reviews). Example: https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID`;
}

export function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] || fullName;
}

export function reviewEmailSubject(): string {
  return `How did we do? — ${siteConfig.name}`;
}
