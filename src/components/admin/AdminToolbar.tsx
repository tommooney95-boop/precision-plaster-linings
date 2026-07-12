"use client";

import {
  DEFAULT_LEAD_FILTERS,
  filtersAreActive,
} from "@/lib/leads/admin-filters";
import type { LeadFilters, LeadPriority, LeadSource, LeadStatus } from "@/lib/leads/types";
import { cn } from "@/lib/utils";
import { ChevronDown, Download, Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

interface AdminToolbarProps {
  filters: LeadFilters;
  projectTypes: string[];
  resultCount: number;
  totalCount: number;
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
  resultCount,
  totalCount,
  onFiltersChange,
  onExport,
  exporting,
}: AdminToolbarProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const hasActive = filtersAreActive(filters);

  function set(key: keyof LeadFilters, value: string | boolean) {
    onFiltersChange({ ...filters, [key]: value });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-white/50">
          Showing{" "}
          <span className="font-semibold text-white">{resultCount}</span>
          {resultCount !== totalCount && (
            <>
              {" "}
              of <span className="font-semibold text-white">{totalCount}</span>
            </>
          )}{" "}
          {resultCount === 1 ? "enquiry" : "enquiries"}
          {hasActive && <span className="text-white/30"> · filtered</span>}
        </p>
        <div className="flex gap-2 sm:hidden">
          <button
            type="button"
            onClick={() => setFiltersOpen((o) => !o)}
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium",
              hasActive || filtersOpen
                ? "border-accent/40 bg-accent-muted text-accent"
                : "border-surface-border bg-surface-elevated text-white"
            )}
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            Filters
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                filtersOpen && "rotate-180"
              )}
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            onClick={onExport}
            disabled={exporting}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-surface-border bg-surface-elevated px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            CSV
          </button>
        </div>
      </div>

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
          className="hidden items-center justify-center gap-2 rounded-xl border border-surface-border bg-surface-elevated px-4 py-2.5 text-sm font-medium text-white hover:border-accent/50 disabled:opacity-50 sm:inline-flex"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Export CSV
        </button>
      </div>

      <div
        className={cn(
          "flex-wrap gap-2",
          filtersOpen ? "flex" : "hidden sm:flex"
        )}
      >
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
              {s === "all"
                ? "All sources"
                : s === "quote-form"
                  ? "Quote Form"
                  : "Quote Assistant"}
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

        <button
          type="button"
          onClick={() => set("newTodayOnly", !filters.newTodayOnly)}
          className={cn(
            "rounded-lg px-3 py-2 text-sm font-medium transition-all",
            filters.newTodayOnly
              ? "bg-accent text-white"
              : "border border-surface-border bg-surface-elevated text-white/60 hover:text-white"
          )}
        >
          Today
        </button>

        {hasActive && (
          <button
            type="button"
            onClick={() => onFiltersChange({ ...DEFAULT_LEAD_FILTERS })}
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
