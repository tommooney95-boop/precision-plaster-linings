import type { QuoteFormData } from "@/data/quote-form";
import type { QuoteAssistantAnswers } from "@/lib/quote-assistant/types";
import type { Lead, LeadPhoto, LeadSource, ScoringInput } from "./types";
import { scoreLead } from "./scoring";
import { randomUUID } from "crypto";

function inferPropertyTypeFromJob(jobType: string): ScoringInput["propertyType"] {
  const commercial = ["Commercial Project", "Office Fit-out", "Suspended Ceiling"];
  if (commercial.some((c) => jobType.includes(c))) return "commercial";
  return "residential";
}

function normalizeJobType(jobType: string): string {
  if (jobType === "Small Patch Repair") return "Patch Repair";
  return jobType;
}

export function normalizeQuoteForm(
  data: QuoteFormData,
  hasPhotos = false
): ScoringInput {
  const commercialJobs = ["Commercial Project", "Office Fit-out", "Suspended Ceiling"];
  const isCommercial =
    commercialJobs.includes(data.jobType) || data.projectSize === "Commercial Scale";

  return {
    propertyType: isCommercial ? "commercial" : "residential",
    jobType: normalizeJobType(data.jobType),
    budget: data.budget,
    projectSize: data.projectSize,
    urgency: data.startDate || undefined,
    suburb: data.suburb,
    waterDamage:
      data.jobType === "Insurance Work" ||
      data.description.toLowerCase().includes("water"),
    descriptionLength: data.description.length,
    hasPhotos,
  };
}

export function normalizeQuoteAssistant(
  answers: QuoteAssistantAnswers,
  hasPhotos = false
): ScoringInput {
  const propertyType =
    answers.propertyType === "Commercial"
      ? "commercial"
      : answers.propertyType === "Residential"
        ? "residential"
        : inferPropertyTypeFromJob(answers.workType ?? "");

  return {
    propertyType,
    jobType: normalizeJobType(answers.workType ?? "Other"),
    squareMetres: answers.squareMetres ? parseFloat(answers.squareMetres) : undefined,
    urgency: answers.completionTimeline,
    suburb: answers.suburb,
    waterDamage: answers.waterDamage === "Yes",
    commercialFloorCount: answers.commercialFloorCount,
    hasPhotos,
    descriptionLength: answers.waterDamageDetails?.length ?? 0,
  };
}

export function buildLeadFromQuoteForm(
  data: QuoteFormData,
  photos: LeadPhoto[] = []
): Lead {
  const scoringInput = normalizeQuoteForm(data, photos.length > 0);
  const now = new Date().toISOString();

  return {
    id: randomUUID(),
    source: "quote-form",
    status: "new",
    read: false,
    createdAt: now,
    updatedAt: now,
    contact: {
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      suburb: data.suburb,
      address: data.address,
      contactMethod: data.contactMethod,
    },
    project: {
      jobType: normalizeJobType(data.jobType),
      propertyType: scoringInput.propertyType,
      budget: data.budget,
      projectSize: data.projectSize,
      urgency: data.startDate,
      waterDamage: scoringInput.waterDamage,
      description: data.description,
    },
    score: scoreLead(scoringInput),
    photos,
  };
}

export function buildLeadFromQuoteAssistant(
  answers: QuoteAssistantAnswers,
  photos: LeadPhoto[] = []
): Lead {
  const scoringInput = normalizeQuoteAssistant(answers, photos.length > 0);
  const now = new Date().toISOString();

  return {
    id: randomUUID(),
    source: "quote-assistant",
    status: "new",
    read: false,
    createdAt: now,
    updatedAt: now,
    contact: {
      fullName: answers.fullName ?? "",
      phone: answers.phone ?? "",
      email: answers.email ?? "",
      suburb: answers.suburb,
    },
    project: {
      jobType: normalizeJobType(answers.workType ?? "Other"),
      propertyType: scoringInput.propertyType,
      squareMetres: scoringInput.squareMetres,
      urgency: answers.completionTimeline,
      waterDamage: scoringInput.waterDamage,
      commercialBusinessName: answers.commercialBusinessName,
      commercialFloorCount: answers.commercialFloorCount,
      description: answers.waterDamageDetails,
    },
    score: scoreLead(scoringInput),
    photos,
  };
}

export function buildLead(
  source: LeadSource,
  data: QuoteFormData | QuoteAssistantAnswers,
  photos: LeadPhoto[] = []
): Lead {
  if (source === "quote-form") {
    return buildLeadFromQuoteForm(data as QuoteFormData, photos);
  }
  return buildLeadFromQuoteAssistant(data as QuoteAssistantAnswers, photos);
}
