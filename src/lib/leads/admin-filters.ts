import type { LeadFilters, LeadPriority, LeadSource, LeadStatus } from "@/lib/leads/types";

export const DEFAULT_LEAD_FILTERS: LeadFilters = {
  search: "",
  priority: "all",
  status: "all",
  source: "all",
  projectType: "all",
  unreadOnly: false,
  newTodayOnly: false,
};

export function parseLeadFilters(
  params: URLSearchParams | { get(name: string): string | null }
): LeadFilters {
  return {
    search: params.get("search") ?? "",
    priority: (params.get("priority") as LeadPriority | "all") || "all",
    status: (params.get("status") as LeadStatus | "all") || "all",
    source: (params.get("source") as LeadSource | "all") || "all",
    projectType: params.get("projectType") ?? "all",
    unreadOnly: params.get("unread") === "true",
    newTodayOnly: params.get("today") === "true",
  };
}

export function buildLeadQueryString(
  filters: LeadFilters,
  leadId?: string | null
): string {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.priority && filters.priority !== "all") {
    params.set("priority", filters.priority);
  }
  if (filters.status && filters.status !== "all") {
    params.set("status", filters.status);
  }
  if (filters.source && filters.source !== "all") {
    params.set("source", filters.source);
  }
  if (filters.projectType && filters.projectType !== "all") {
    params.set("projectType", filters.projectType);
  }
  if (filters.unreadOnly) params.set("unread", "true");
  if (filters.newTodayOnly) params.set("today", "true");
  if (leadId) params.set("lead", leadId);
  return params.toString();
}

export function filtersAreActive(filters: LeadFilters): boolean {
  return Boolean(
    filters.search ||
      (filters.priority && filters.priority !== "all") ||
      (filters.status && filters.status !== "all") ||
      (filters.source && filters.source !== "all") ||
      (filters.projectType && filters.projectType !== "all") ||
      filters.unreadOnly ||
      filters.newTodayOnly
  );
}

export function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
