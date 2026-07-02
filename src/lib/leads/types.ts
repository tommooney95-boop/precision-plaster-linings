export type LeadPriority = "hot" | "high" | "medium" | "low";

export type LeadSource = "quote-form" | "quote-assistant";

export type LeadStatus = "new" | "contacted" | "quoted" | "won" | "lost";

export interface LeadPhoto {
  filename: string;
  originalName: string;
}

export interface ScoreFactor {
  score: number;
  max: number;
  label: string;
  detail: string;
}

export interface LeadScore {
  total: number;
  priority: LeadPriority;
  factors: {
    budget: ScoreFactor;
    urgency: ScoreFactor;
    projectValue: ScoreFactor;
    commercialSize: ScoreFactor;
    location: ScoreFactor;
    complexity: ScoreFactor;
    propertyType: ScoreFactor;
  };
  recommendation: string;
}

export interface ScoringInput {
  propertyType: "residential" | "commercial" | "unknown";
  jobType: string;
  budget?: string;
  projectSize?: string;
  squareMetres?: number;
  urgency?: string;
  suburb?: string;
  waterDamage?: boolean;
  commercialFloorCount?: string;
  hasPhotos?: boolean;
  descriptionLength?: number;
}

export interface LeadContact {
  fullName: string;
  phone: string;
  email: string;
  suburb?: string;
  address?: string;
  contactMethod?: string;
}

export interface LeadProject {
  jobType: string;
  propertyType: string;
  budget?: string;
  projectSize?: string;
  squareMetres?: number;
  urgency?: string;
  waterDamage?: boolean;
  commercialBusinessName?: string;
  commercialFloorCount?: string;
  description?: string;
}

export interface Lead {
  id: string;
  source: LeadSource;
  status: LeadStatus;
  read: boolean;
  createdAt: string;
  updatedAt: string;
  contact: LeadContact;
  project: LeadProject;
  score: LeadScore;
  photos: LeadPhoto[];
}

export interface LeadStats {
  total: number;
  unread: number;
  hot: number;
  high: number;
  medium: number;
  low: number;
  averageScore: number;
  newToday: number;
  quoteForm: number;
  quoteAssistant: number;
}

export interface LeadFilters {
  search?: string;
  priority?: LeadPriority | "all";
  status?: LeadStatus | "all";
  source?: LeadSource | "all";
  projectType?: string;
  unreadOnly?: boolean;
}
