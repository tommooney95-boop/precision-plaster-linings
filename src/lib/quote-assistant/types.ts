/** Quote Assistant — shared types */

export type WorkType =
  | "Patch Repair"
  | "Ceiling Repair"
  | "Wall Repair"
  | "Cornice"
  | "New Home"
  | "Renovation"
  | "Commercial Project"
  | "Insurance Work"
  | "Office Fit-out"
  | "Suspended Ceiling"
  | "Other";

export type PropertyType = "Residential" | "Commercial";

export type ProjectCategory = "New Home" | "Renovation" | "Repair" | "Not Applicable";

export type SurfaceType = "Ceiling" | "Walls" | "Both";

export type HoleSize = "Small (under 10 cm)" | "Medium (10–30 cm)" | "Large (over 30 cm)";

export type WaterDamage = "Yes" | "No";

export type CompletionTimeline =
  | "ASAP"
  | "Within 2 weeks"
  | "1–2 months"
  | "Flexible";

export type CommercialFloorCount =
  | "Ground floor only"
  | "1–2 floors"
  | "3–5 floors"
  | "5+ floors";

export type CommercialAccess =
  | "During business hours"
  | "After hours"
  | "Weekends only"
  | "Flexible";

export interface QuoteAssistantAnswers {
  workType?: WorkType;
  holeSize?: HoleSize;
  propertyType?: PropertyType;
  commercialBusinessName?: string;
  commercialFloorCount?: CommercialFloorCount;
  commercialAccess?: CommercialAccess;
  projectCategory?: ProjectCategory;
  surfaces?: SurfaceType;
  squareMetres?: string;
  waterDamage?: WaterDamage;
  waterDamageDetails?: string;
  completionTimeline?: CompletionTimeline;
  photos?: File[];
  fullName?: string;
  phone?: string;
  email?: string;
  suburb?: string;
}

export type InputType =
  | "select"
  | "text"
  | "tel"
  | "email"
  | "number"
  | "textarea"
  | "file"
  | "none";

export interface SelectOption {
  label: string;
  value: string;
}

export interface FlowStep {
  id: string;
  /** Question shown in the chat bubble */
  question: string;
  /** Optional helper text below the question */
  hint?: string;
  inputType: InputType;
  options?: SelectOption[];
  placeholder?: string;
  required?: boolean;
  /** Key in QuoteAssistantAnswers this step writes to */
  answerKey?: keyof QuoteAssistantAnswers;
  /** Whether this step accepts multiple file uploads */
  multiple?: boolean;
}

export type MessageRole = "assistant" | "user";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

export interface QuoteAssistantSubmission {
  answers: QuoteAssistantAnswers;
  summary: string;
  submittedAt: string;
  source: "quote-assistant";
}
