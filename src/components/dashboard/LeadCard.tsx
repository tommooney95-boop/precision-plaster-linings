"use client";

import type { Lead, LeadPriority, LeadStatus } from "@/lib/leads/types";
import { PRIORITY_COLORS, PRIORITY_LABELS } from "@/lib/leads/scoring";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Mail, Phone } from "lucide-react";
import { useEffect, useState } from "react";

interface LeadCardProps {
  lead: Lead;
  onStatusChange: (id: string, status: LeadStatus) => void;
}

const STATUS_OPTIONS: LeadStatus[] = [
  "new",
  "contacted",
  "quoted",
  "won",
  "lost",
];

function ScoreRing({ score, priority }: { score: number; priority: LeadPriority }) {
  const circumference = 2 * Math.PI * 28;
  const offset = circumference - (score / 100) * circumference;
  const strokeColor =
    priority === "hot"
      ? "#D90429"
      : priority === "high"
        ? "#f97316"
        : priority === "medium"
          ? "#eab308"
          : "#666";

  return (
    <div className="relative h-16 w-16 shrink-0">
      <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="28" fill="none" stroke="#2A2A2A" strokeWidth="4" />
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke={strokeColor}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
        {score}
      </span>
    </div>
  );
}

export function LeadCard({ lead, onStatusChange }: LeadCardProps) {
  const [expanded, setExpanded] = useState(lead.score.priority === "hot");
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    setTimeAgo(getTimeAgo(new Date(lead.createdAt)));
  }, [lead.createdAt]);

  return (
    <article
      className={cn(
        "rounded-2xl border bg-surface transition-all",
        lead.score.priority === "hot"
          ? "border-accent/40 shadow-glow"
          : "border-surface-border"
      )}
    >
      <div className="flex items-start gap-4 p-5">
        <ScoreRing score={lead.score.total} priority={lead.score.priority} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
                PRIORITY_COLORS[lead.score.priority]
              )}
            >
              {PRIORITY_LABELS[lead.score.priority]}
            </span>
            <span className="text-xs text-white/30">{timeAgo}</span>
            <span className="text-xs text-white/30">·</span>
            <span className="text-xs capitalize text-white/30">
              {lead.source.replace("-", " ")}
            </span>
          </div>

          <h3 className="mt-2 truncate text-lg font-bold text-white">
            {lead.contact.fullName}
          </h3>
          <p className="text-sm text-white/50">
            {lead.project.jobType}
            {lead.contact.suburb ? ` · ${lead.contact.suburb}` : ""}
            {lead.project.budget ? ` · ${lead.project.budget}` : ""}
          </p>

          <p className="mt-2 text-sm text-accent/80">{lead.score.recommendation}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href={`tel:${lead.contact.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-accent-muted px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/20"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              {lead.contact.phone}
            </a>
            <a
              href={`mailto:${lead.contact.email}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 hover:bg-white/10"
            >
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              Email
            </a>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="rounded-lg p-2 text-white/40 hover:bg-surface-elevated hover:text-white"
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse details" : "Expand details"}
        >
          {expanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-surface-border px-5 py-4">
          <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {Object.values(lead.score.factors).map((factor) => (
              <div
                key={factor.label}
                className="rounded-xl bg-surface-elevated px-3 py-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/40">{factor.label}</span>
                  <span className="text-xs font-bold text-white">
                    {factor.score}/{factor.max}
                  </span>
                </div>
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-accent transition-all"
                    style={{ width: `${(factor.score / factor.max) * 100}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-white/30">{factor.detail}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor={`status-${lead.id}`} className="text-sm text-white/50">
              Status:
            </label>
            <select
              id={`status-${lead.id}`}
              value={lead.status}
              onChange={(e) =>
                onStatusChange(lead.id, e.target.value as LeadStatus)
              }
              className="rounded-lg border border-surface-border bg-surface-elevated px-3 py-1.5 text-sm text-white focus:border-accent focus:outline-none"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </article>
  );
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
