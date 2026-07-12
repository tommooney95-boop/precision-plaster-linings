import type {
  FlowStep,
  QuoteAssistantAnswers,
  WorkType,
} from "./types";

const COMMERCIAL_WORK_TYPES: WorkType[] = [
  "Commercial Project",
  "Office Fit-out",
  "Suspended Ceiling",
];

export const FLOW_STEPS: Record<string, FlowStep> = {
  welcome: {
    id: "welcome",
    question:
      "Hi! I'm the Precision Plaster Linings quote assistant. I'll ask a few quick questions so we can prepare your free quote. Let's get started.",
    inputType: "none",
  },
  workType: {
    id: "workType",
    question: "What type of work do you need?",
    inputType: "select",
    answerKey: "workType",
    required: true,
    options: [
      { label: "Patch Repair", value: "Patch Repair" },
      { label: "Ceiling Repair", value: "Ceiling Repair" },
      { label: "Wall Repair", value: "Wall Repair" },
      { label: "Cornice", value: "Cornice" },
      { label: "New Home", value: "New Home" },
      { label: "Renovation", value: "Renovation" },
      { label: "Commercial Project", value: "Commercial Project" },
      { label: "Insurance Work", value: "Insurance Work" },
      { label: "Office Fit-out", value: "Office Fit-out" },
      { label: "Suspended Ceiling", value: "Suspended Ceiling" },
      { label: "Other", value: "Other" },
    ],
  },
  holeSize: {
    id: "holeSize",
    question: "What's the approximate size of the patch or hole?",
    hint: "This helps us estimate materials and time on site.",
    inputType: "select",
    answerKey: "holeSize",
    required: true,
    options: [
      { label: "Small (under 10 cm)", value: "Small (under 10 cm)" },
      { label: "Medium (10–30 cm)", value: "Medium (10–30 cm)" },
      { label: "Large (over 30 cm)", value: "Large (over 30 cm)" },
    ],
  },
  propertyType: {
    id: "propertyType",
    question: "Is this a residential or commercial property?",
    inputType: "select",
    answerKey: "propertyType",
    required: true,
    options: [
      { label: "Residential", value: "Residential" },
      { label: "Commercial", value: "Commercial" },
    ],
  },
  commercialBusinessName: {
    id: "commercialBusinessName",
    question: "What's the business or site name?",
    hint: "e.g. office building, retail store, or development name.",
    inputType: "text",
    answerKey: "commercialBusinessName",
    placeholder: "Business or site name",
    required: true,
  },
  commercialFloorCount: {
    id: "commercialFloorCount",
    question: "How many floors does the project involve?",
    inputType: "select",
    answerKey: "commercialFloorCount",
    required: true,
    options: [
      { label: "Ground floor only", value: "Ground floor only" },
      { label: "1–2 floors", value: "1–2 floors" },
      { label: "3–5 floors", value: "3–5 floors" },
      { label: "5+ floors", value: "5+ floors" },
    ],
  },
  commercialAccess: {
    id: "commercialAccess",
    question: "When can our team access the site?",
    inputType: "select",
    answerKey: "commercialAccess",
    required: true,
    options: [
      { label: "During business hours", value: "During business hours" },
      { label: "After hours", value: "After hours" },
      { label: "Weekends only", value: "Weekends only" },
      { label: "Flexible", value: "Flexible" },
    ],
  },
  projectCategory: {
    id: "projectCategory",
    question: "Is this a new home build or a renovation?",
    inputType: "select",
    answerKey: "projectCategory",
    required: true,
    options: [
      { label: "New Home", value: "New Home" },
      { label: "Renovation", value: "Renovation" },
      { label: "Repair only", value: "Repair" },
    ],
  },
  surfaces: {
    id: "surfaces",
    question: "Which surfaces need work — ceiling, walls, or both?",
    inputType: "select",
    answerKey: "surfaces",
    required: true,
    options: [
      { label: "Ceiling", value: "Ceiling" },
      { label: "Walls", value: "Walls" },
      { label: "Both", value: "Both" },
    ],
  },
  squareMetres: {
    id: "squareMetres",
    question: "What's the approximate area in square metres?",
    hint: "A rough estimate is fine — e.g. 25 for an average bedroom.",
    inputType: "number",
    answerKey: "squareMetres",
    placeholder: "e.g. 25",
    required: true,
  },
  waterDamage: {
    id: "waterDamage",
    question: "Is there any water damage involved?",
    inputType: "select",
    answerKey: "waterDamage",
    required: true,
    options: [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" },
    ],
  },
  waterDamageDetails: {
    id: "waterDamageDetails",
    question: "Can you briefly describe the water damage?",
    hint: "Include when it occurred and which areas are affected.",
    inputType: "textarea",
    answerKey: "waterDamageDetails",
    placeholder: "e.g. Ceiling stain from recent storm, bedroom 2...",
    required: true,
  },
  completionTimeline: {
    id: "completionTimeline",
    question: "When would you like the work completed?",
    inputType: "select",
    answerKey: "completionTimeline",
    required: true,
    options: [
      { label: "ASAP", value: "ASAP" },
      { label: "Within 2 weeks", value: "Within 2 weeks" },
      { label: "1–2 months", value: "1–2 months" },
      { label: "Flexible", value: "Flexible" },
    ],
  },
  photos: {
    id: "photos",
    question: "Would you like to upload photos of the area?",
    hint: "Photos help us provide a more accurate quote. You can skip this step.",
    inputType: "file",
    answerKey: "photos",
    required: false,
    multiple: true,
  },
  suburb: {
    id: "suburb",
    question: "What suburb is the project located in?",
    hint: "This helps us confirm we're in your service area.",
    inputType: "text",
    answerKey: "suburb",
    placeholder: "e.g. Albury",
    required: true,
  },
  fullName: {
    id: "fullName",
    question: "What's your full name?",
    inputType: "text",
    answerKey: "fullName",
    placeholder: "John Smith",
    required: true,
  },
  phone: {
    id: "phone",
    question: "What's the best phone number to reach you?",
    inputType: "tel",
    answerKey: "phone",
    placeholder: "0400 000 000",
    required: true,
  },
  email: {
    id: "email",
    question: "And your email address?",
    inputType: "email",
    answerKey: "email",
    placeholder: "john@example.com",
    required: true,
  },
  summary: {
    id: "summary",
    question:
      "Here's a summary of your quote request. Please review and submit when you're ready.",
    inputType: "none",
  },
  submitted: {
    id: "submitted",
    question:
      "Thank you! Your quote request has been sent. We'll contact you within 2 business days.",
    inputType: "none",
  },
};

/** Ordered step IDs — engine resolves conditionals at runtime */
const BASE_FLOW = [
  "welcome",
  "workType",
] as const;

function isCommercialWorkType(workType?: WorkType): boolean {
  return !!workType && COMMERCIAL_WORK_TYPES.includes(workType);
}

function isCommercialAnswers(answers: QuoteAssistantAnswers): boolean {
  return (
    answers.propertyType === "Commercial" ||
    isCommercialWorkType(answers.workType)
  );
}

function needsProjectCategory(answers: QuoteAssistantAnswers): boolean {
  const wt = answers.workType;
  if (!wt) return false;
  if (wt === "New Home" || wt === "Renovation") return false;
  if (isCommercialWorkType(wt)) return false;
  if (
    wt === "Patch Repair" ||
    wt === "Ceiling Repair" ||
    wt === "Wall Repair" ||
    wt === "Insurance Work" ||
    wt === "Cornice"
  )
    return false;
  return answers.propertyType === "Residential";
}

function needsSurfaces(answers: QuoteAssistantAnswers): boolean {
  const wt = answers.workType;
  if (wt === "Patch Repair") return false;
  if (wt === "Cornice") return false;
  if (wt === "Suspended Ceiling") return false;
  return true;
}

function needsSquareMetres(answers: QuoteAssistantAnswers): boolean {
  return answers.workType !== "Patch Repair";
}

/** Resolve the full ordered list of step IDs for given answers */
export function resolveFlow(answers: QuoteAssistantAnswers): string[] {
  const steps: string[] = [...BASE_FLOW];

  if (answers.workType === "Patch Repair") {
    steps.push("holeSize");
  }

  // Property type — skip if work type already implies commercial
  if (!isCommercialWorkType(answers.workType)) {
    steps.push("propertyType");
  }

  if (isCommercialAnswers(answers)) {
    steps.push("commercialBusinessName", "commercialFloorCount", "commercialAccess");
  }

  if (needsProjectCategory(answers)) {
    steps.push("projectCategory");
  }

  if (needsSurfaces(answers)) {
    steps.push("surfaces");
  }

  if (needsSquareMetres(answers)) {
    steps.push("squareMetres");
  }

  steps.push("waterDamage");

  if (answers.waterDamage === "Yes") {
    steps.push("waterDamageDetails");
  }

  steps.push(
    "completionTimeline",
    "photos",
    "suburb",
    "fullName",
    "phone",
    "email",
    "summary"
  );

  return steps;
}

export function getStep(id: string): FlowStep {
  return FLOW_STEPS[id];
}

export function getNextStepId(
  currentId: string,
  answers: QuoteAssistantAnswers
): string | null {
  const flow = resolveFlow(answers);
  const idx = flow.indexOf(currentId);
  if (idx === -1 || idx >= flow.length - 1) return null;
  return flow[idx + 1];
}

export function getFirstQuestionStepId(): string {
  return "workType";
}

export function formatAnswerForDisplay(
  step: FlowStep,
  value: unknown
): string {
  if (step.inputType === "file" && Array.isArray(value)) {
    const files = value as File[];
    if (files.length === 0) return "No photos uploaded";
    return files.length === 1
      ? `1 photo uploaded`
      : `${files.length} photos uploaded`;
  }
  if (typeof value === "string") return value;
  return String(value ?? "");
}

export function isCommercialWorkTypeCheck(workType?: WorkType): boolean {
  return isCommercialWorkType(workType);
}
