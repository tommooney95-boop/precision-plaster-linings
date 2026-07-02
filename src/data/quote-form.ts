export const jobTypes = [
  "Patch Repair",
  "Ceiling Repair",
  "Wall Repair",
  "Cornice",
  "New Home",
  "Renovation",
  "Commercial Project",
  "Insurance Work",
  "Office Fit-out",
  "Suspended Ceiling",
  "Other",
] as const;

export const projectSizes = [
  "Small",
  "Medium",
  "Large",
  "Commercial Scale",
] as const;

export const budgetRanges = [
  "Under $1,000",
  "$1,000 – $5,000",
  "$5,000 – $10,000",
  "$10,000+",
] as const;

export const contactMethods = ["Phone", "Email", "Either"] as const;

export type JobType = (typeof jobTypes)[number];
export type ProjectSize = (typeof projectSizes)[number];
export type BudgetRange = (typeof budgetRanges)[number];
export type ContactMethod = (typeof contactMethods)[number];

export interface QuoteFormData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  suburb: string;
  contactMethod: ContactMethod;
  jobType: JobType;
  projectSize: ProjectSize;
  budget: BudgetRange;
  startDate: string;
  description: string;
}
