"use client";

import type { LeadFilters, LeadPriority, LeadSource, LeadStatus } from "@/lib/leads/types";
import { cn } from "@/lib/utils";
import { Download, Search, X } from "lucide-react";

interface AdminToolbarProps {
  filters: LeadFilters;
  projectTypes: string[];
  onFiltersChange: (filters: LeadFilters) => void;
  onExport: () => void;
  exporting: boolean;
}

const PRIORITIES: (LeadPriority | "all")[] = ["all", "hot", "high", "medium", "low"];
const STATUSES: (LeadStatus | "all")[] = [
  "all",
  "new",
  "contacted",
  "quoted",
  "won",
  "completed",
  "lost",
];
const SOURCES: (LeadSource | "all")[] = ["all", "quote-form", "quote-assistant"];

const selectClass =
  "rounded-lg border border-surface-border bg-surface-elevated px-3 py-2 text-sm text-white focus:border-accent focus:outline-none";

export function AdminToolbar({
  filters,
  projectTypes,
  onFiltersChange,
  onExport,
  exporting,
}: AdminToolbarProps) {
  function set(key: keyof LeadFilters, value: string | boolean) {
    onFiltersChange({ ...filters, [key]: value });
  }

  const hasActiveFilters =
    filters.search ||
    filters.priority !== "all" ||
    filters.status !== "all" ||
    filters.source !== "all" ||
    filters.projectType !== "all" ||
    filters.unreadOnly;

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search name, email, phone, suburb, project..."
            value={filters.search ?? ""}
            onChange={(e) => set("search", e.target.value)}
            className="w-full rounded-xl border border-surface-border bg-surface-elevated py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            aria-label="Search enquiries"
          />
        </div>
        <button
          type="button"
          onClick={onExport}
          disabled={exporting}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-surface-border bg-surface-elevated px-4 py-2.5 text-sm font-medium text-white hover:border-accent/50 disabled:opacity-50"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Export CSV
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          value={filters.priority ?? "all"}
          onChange={(e) => set("priority", e.target.value)}
          className={selectClass}
          aria-label="Filter by priority"
        >
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p === "all" ? "All priorities" : p.charAt(0).toUpperCase() + p.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={filters.status ?? "all"}
          onChange={(e) => set("status", e.target.value)}
          className={selectClass}
          aria-label="Filter by status"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s === "all" ? "All statuses" : s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={filters.source ?? "all"}
          onChange={(e) => set("source", e.target.value)}
          className={selectClass}
          aria-label="Filter by source"
        >
          {SOURCES.map((s) => (
            <option key={s} value={s}>
              {s === "all" ? "All sources" : s === "quote-form" ? "Quote Form" : "Quote Assistant"}
            </option>
          ))}
        </select>

        <select
          value={filters.projectType ?? "all"}
          onChange={(e) => set("projectType", e.target.value)}
          className={selectClass}
          aria-label="Filter by project type"
        >
          <option value="all">All project types</option>
          {projectTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => set("unreadOnly", !filters.unreadOnly)}
          className={cn(
            "rounded-lg px-3 py-2 text-sm font-medium transition-all",
            filters.unreadOnly
              ? "bg-accent text-white"
              : "border border-surface-border bg-surface-elevated text-white/60 hover:text-white"
          )}
        >
          Unread only
        </button>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={() =>
              onFiltersChange({
                search: "",
                priority: "all",
                status: "all",
                source: "all",
                projectType: "all",
                unreadOnly: false,
              })
            }
            className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-white/40 hover:text-white"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
