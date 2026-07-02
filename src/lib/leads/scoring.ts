import { siteConfig } from "@/lib/site-config";
import type { LeadPriority, LeadScore, ScoringInput } from "./types";

const PRIORITY_THRESHOLDS: { min: number; priority: LeadPriority }[] = [
  { min: 80, priority: "hot" },
  { min: 60, priority: "high" },
  { min: 40, priority: "medium" },
  { min: 0, priority: "low" },
];

function getPriority(total: number): LeadPriority {
  return PRIORITY_THRESHOLDS.find((t) => total >= t.min)?.priority ?? "low";
}

function scoreBudget(budget?: string) {
  const max = 20;
  const map: Record<string, { score: number; detail: string }> = {
    "Under $1,000": { score: 4, detail: "Small budget — patch/repair tier" },
    "Under $1000": { score: 4, detail: "Small budget — patch/repair tier" },
    "$1,000 – $5,000": { score: 10, detail: "Mid-range residential budget" },
    "$1000-$5000": { score: 10, detail: "Mid-range residential budget" },
    "$5,000 – $10,000": { score: 16, detail: "Strong project budget" },
    "$5000-$10000": { score: 16, detail: "Strong project budget" },
    "$10,000+": { score: 20, detail: "High-value project budget" },
  };

  if (!budget) {
    return { score: 8, max, label: "Budget", detail: "Budget not specified — estimated mid-range" };
  }

  const match = map[budget] ?? { score: 8, detail: budget };
  return { score: match.score, max, label: "Budget", detail: match.detail };
}

function scoreUrgency(urgency?: string) {
  const max = 20;
  if (!urgency) {
    return { score: 8, max, label: "Urgency", detail: "Timeline not specified" };
  }

  const u = urgency.toLowerCase();
  if (u.includes("asap") || u.includes("urgent") || u.includes("immediate")) {
    return { score: 20, max, label: "Urgency", detail: "Needs work ASAP — act today" };
  }
  if (u.includes("2 week") || u.includes("within 2")) {
    return { score: 16, max, label: "Urgency", detail: "Within 2 weeks — high urgency" };
  }
  if (u.includes("1–2 month") || u.includes("1-2 month")) {
    return { score: 10, max, label: "Urgency", detail: "1–2 month timeline" };
  }
  if (u.includes("flexible")) {
    return { score: 5, max, label: "Urgency", detail: "Flexible timeline" };
  }

  // Date string from form — check if within 14 days
  const parsed = Date.parse(urgency);
  if (!isNaN(parsed)) {
    const days = Math.ceil((parsed - Date.now()) / (1000 * 60 * 60 * 24));
    if (days <= 7) return { score: 20, max, label: "Urgency", detail: `Start date in ${days} days — urgent` };
    if (days <= 14) return { score: 16, max, label: "Urgency", detail: `Start date in ${days} days` };
    if (days <= 30) return { score: 10, max, label: "Urgency", detail: `Start date in ${days} days` };
    return { score: 5, max, label: "Urgency", detail: `Start date in ${days} days — low urgency` };
  }

  return { score: 8, max, label: "Urgency", detail: urgency };
}

function scoreProjectValue(input: ScoringInput) {
  const max = 15;
  let score = 0;
  const parts: string[] = [];

  const sizeScores: Record<string, number> = {
    Small: 3,
    Medium: 7,
    Large: 11,
    "Commercial Scale": 15,
  };
  if (input.projectSize && sizeScores[input.projectSize]) {
    score = Math.max(score, sizeScores[input.projectSize]);
    parts.push(input.projectSize);
  }

  if (input.squareMetres) {
    if (input.squareMetres >= 200) {
      score = Math.max(score, 15);
      parts.push(`${input.squareMetres} m² (large area)`);
    } else if (input.squareMetres >= 80) {
      score = Math.max(score, 11);
      parts.push(`${input.squareMetres} m²`);
    } else if (input.squareMetres >= 30) {
      score = Math.max(score, 7);
      parts.push(`${input.squareMetres} m²`);
    } else {
      score = Math.max(score, 4);
      parts.push(`${input.squareMetres} m² (small area)`);
    }
  }

  if (score === 0) {
    return { score: 6, max, label: "Project Value", detail: "Size not specified — estimated mid-range" };
  }

  return { score, max, label: "Project Value", detail: parts.join(" · ") };
}

function scoreCommercialSize(input: ScoringInput) {
  const max = 15;

  if (input.propertyType !== "commercial") {
    return { score: 0, max, label: "Commercial Size", detail: "Residential enquiry — N/A" };
  }

  const floorScores: Record<string, number> = {
    "Ground floor only": 6,
    "1–2 floors": 10,
    "3–5 floors": 13,
    "5+ floors": 15,
  };

  if (input.commercialFloorCount && floorScores[input.commercialFloorCount]) {
    return {
      score: floorScores[input.commercialFloorCount],
      max,
      label: "Commercial Size",
      detail: input.commercialFloorCount,
    };
  }

  const commercialJobs = ["Commercial Project", "Office Fit-out", "Suspended Ceiling"];
  if (commercialJobs.some((j) => input.jobType.includes(j))) {
    return { score: 10, max, label: "Commercial Size", detail: "Commercial project — scale unspecified" };
  }

  return { score: 6, max, label: "Commercial Size", detail: "Commercial property" };
}

function scoreLocation(suburb?: string) {
  const max = 10;
  if (!suburb) {
    return { score: 5, max, label: "Location", detail: "Suburb not provided" };
  }

  const s = suburb.toLowerCase();

  const premium = [
    "albury", "wodonga", "lavington", "thurgoona", "north albury", "east albury",
  ];
  const metro = [
    "corowa", "yarrawonga", "holbrook", "howlong", "jindera", "barnawartha",
    "border region", "albury-wodonga", "wodonga vic",
  ];

  if (premium.some((p) => s.includes(p))) {
    return { score: 10, max, label: "Location", detail: `${suburb} — premium service area` };
  }
  if (metro.some((m) => s.includes(m)) || s.includes("nsw") || s.includes("vic")) {
    return { score: 8, max, label: "Location", detail: `${suburb} — ${siteConfig.location.serviceArea}` };
  }

  return { score: 5, max, label: "Location", detail: `${suburb} — confirm service area` };
}

function scoreComplexity(input: ScoringInput) {
  const max = 10;
  let score = 3;
  const factors: string[] = [];

  const highComplexity = [
    "New Home", "Renovation", "Commercial Project", "Insurance Work",
    "Office Fit-out", "Suspended Ceiling",
  ];
  const medComplexity = ["Ceiling Repair", "Wall Repair", "Cornice"];

  if (highComplexity.some((j) => input.jobType.includes(j))) {
    score += 4;
    factors.push("Complex job type");
  } else if (medComplexity.some((j) => input.jobType.includes(j))) {
    score += 2;
    factors.push("Moderate complexity");
  }

  if (input.waterDamage) {
    score += 2;
    factors.push("Water damage");
  }
  if (input.hasPhotos) {
    score += 1;
    factors.push("Photos provided");
  }
  if ((input.descriptionLength ?? 0) > 120) {
    score += 1;
    factors.push("Detailed brief");
  }

  return {
    score: Math.min(score, max),
    max,
    label: "Complexity",
    detail: factors.length > 0 ? factors.join(", ") : "Standard scope",
  };
}

function scorePropertyType(input: ScoringInput) {
  const max = 10;

  if (input.propertyType === "commercial") {
    return { score: 10, max, label: "Property Type", detail: "Commercial — higher contract potential" };
  }
  if (input.propertyType === "residential") {
    const highValueResidential = ["New Home", "Renovation"];
    if (highValueResidential.some((j) => input.jobType.includes(j))) {
      return { score: 8, max, label: "Property Type", detail: "Residential — high-value project" };
    }
    return { score: 5, max, label: "Property Type", detail: "Residential enquiry" };
  }

  return { score: 5, max, label: "Property Type", detail: "Property type unknown" };
}

function buildRecommendation(priority: LeadPriority, input: ScoringInput): string {
  const parts: string[] = [];

  switch (priority) {
    case "hot":
      parts.push("Contact immediately — high-value, urgent lead.");
      break;
    case "high":
      parts.push("Follow up within 2 hours.");
      break;
    case "medium":
      parts.push("Follow up within 24 hours.");
      break;
    case "low":
      parts.push("Standard follow-up — lower priority queue.");
      break;
  }

  if (input.propertyType === "commercial") {
    parts.push("Commercial opportunity — prepare detailed quote.");
  }
  if (input.waterDamage) {
    parts.push("Insurance work possible — request photos and claim details.");
  }

  return parts.join(" ");
}

export function scoreLead(input: ScoringInput): LeadScore {
  const factors = {
    budget: scoreBudget(input.budget),
    urgency: scoreUrgency(input.urgency),
    projectValue: scoreProjectValue(input),
    commercialSize: scoreCommercialSize(input),
    location: scoreLocation(input.suburb),
    complexity: scoreComplexity(input),
    propertyType: scorePropertyType(input),
  };

  const total = Math.round(
    Object.values(factors).reduce((sum, f) => sum + f.score, 0)
  );

  const priority = getPriority(total);

  return {
    total,
    priority,
    factors,
    recommendation: buildRecommendation(priority, input),
  };
}

export const PRIORITY_LABELS: Record<LeadPriority, string> = {
  hot: "Hot — Contact Now",
  high: "High Priority",
  medium: "Medium Priority",
  low: "Low Priority",
};

export const PRIORITY_COLORS: Record<LeadPriority, string> = {
  hot: "bg-accent text-white",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  low: "bg-white/10 text-white/50 border-white/10",
};
