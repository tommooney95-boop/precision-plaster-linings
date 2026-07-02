"use client";

import type { Lead, LeadStatus } from "@/lib/leads/types";
import { PRIORITY_COLORS, PRIORITY_LABELS } from "@/lib/leads/scoring";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronUp,
  ImageIcon,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { useState } from "react";

interface AdminLeadRowProps {
  lead: Lead;
  onSelect: (lead: Lead) => void;
  onStatusChange: (id: string, status: LeadStatus) => void;
  onMarkRead: (id: string) => void;
  selected: boolean;
}

const STATUS_OPTIONS: LeadStatus[] = [
  "new",
  "contacted",
  "quoted",
  "won",
  "lost",
];

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80
      ? "text-accent"
      : score >= 60
        ? "text-orange-400"
        : score >= 40
          ? "text-yellow-400"
          : "text-white/40";

  return <span className={cn("font-bold tabular-nums", color)}>{score}</span>;
}

export function AdminLeadRow({
  lead,
  onSelect,
  onStatusChange,
  onMarkRead,
  selected,
}: AdminLeadRowProps) {
  const [expanded, setExpanded] = useState(selected);

  return (
    <div
      className={cn(
        "rounded-xl border bg-surface transition-all",
        !lead.read && "border-accent/30 bg-accent/[0.03]",
        selected ? "border-accent/50" : "border-surface-border"
      )}
    >
      {/* Desktop table row */}
      <div
        className="hidden cursor-pointer items-center gap-4 px-4 py-3 lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_100px_80px_90px_100px_40px]"
        onClick={() => {
          onSelect(lead);
          if (!lead.read) onMarkRead(lead.id);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onSelect(lead)}
      >
        <div className="flex items-center gap-2 min-w-0">
          {!lead.read && (
            <span className="h-2 w-2 shrink-0 rounded-full bg-accent" aria-label="Unread" />
          )}
          <div className="min-w-0">
            <p className="truncate font-medium text-white">{lead.contact.fullName}</p>
            <p className="truncate text-xs text-white/40">{lead.contact.email}</p>
          </div>
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm text-white/70">{lead.project.jobType}</p>
          <p className="truncate text-xs text-white/30">
            {lead.contact.suburb ?? lead.project.propertyType}
          </p>
        </div>
        <span
          className={cn(
            "inline-flex w-fit rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase",
            PRIORITY_COLORS[lead.score.priority]
          )}
        >
          {lead.score.priority}
        </span>
        <ScoreBadge score={lead.score.total} />
        <span className="text-xs capitalize text-white/40">
          {lead.source === "quote-form" ? "Form" : "Assistant"}
        </span>
        <select
          value={lead.status}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onStatusChange(lead.id, e.target.value as LeadStatus)}
          className="rounded-lg border border-surface-border bg-surface-elevated px-2 py-1 text-xs text-white focus:border-accent focus:outline-none"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          className="text-white/30 hover:text-white"
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile card */}
      <div
        className="cursor-pointer p-4 lg:hidden"
        onClick={() => {
          onSelect(lead);
          if (!lead.read) onMarkRead(lead.id);
          setExpanded(!expanded);
        }}
        role="button"
        tabIndex={0}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2">
            {!lead.read && (
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
            )}
            <div>
              <p className="font-medium text-white">{lead.contact.fullName}</p>
              <p className="text-sm text-white/50">{lead.project.jobType}</p>
            </div>
          </div>
          <div className="text-right">
            <ScoreBadge score={lead.score.total} />
            <span
              className={cn(
                "mt-1 inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase",
                PRIORITY_COLORS[lead.score.priority]
              )}
            >
              {lead.score.priority}
            </span>
          </div>
        </div>
      </div>

      {expanded && (
        <AdminLeadDetail
          lead={lead}
          onStatusChange={onStatusChange}
          className="border-t border-surface-border"
        />
      )}
    </div>
  );
}

interface AdminLeadDetailProps {
  lead: Lead;
  onStatusChange: (id: string, status: LeadStatus) => void;
  className?: string;
}

export function AdminLeadDetail({
  lead,
  onStatusChange,
  className,
}: AdminLeadDetailProps) {
  return (
    <div className={cn("grid gap-6 p-4 md:p-5 lg:grid-cols-2", className)}>
      {/* Customer details */}
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-accent">
          Customer Details
        </h4>
        <dl className="space-y-2 text-sm">
          <DetailRow label="Name" value={lead.contact.fullName} />
          <DetailRow label="Phone">
            <a href={`tel:${lead.contact.phone}`} className="text-accent hover:underline">
              {lead.contact.phone}
            </a>
          </DetailRow>
          <DetailRow label="Email">
            <a href={`mailto:${lead.contact.email}`} className="text-accent hover:underline">
              {lead.contact.email}
            </a>
          </DetailRow>
          {lead.contact.suburb && (
            <DetailRow label="Suburb" value={lead.contact.suburb} icon={MapPin} />
          )}
          {lead.contact.address && (
            <DetailRow label="Address" value={lead.contact.address} />
          )}
          {lead.contact.contactMethod && (
            <DetailRow label="Preferred contact" value={lead.contact.contactMethod} />
          )}
        </dl>

        <h4 className="mb-3 mt-5 text-xs font-semibold uppercase tracking-wider text-accent">
          Project
        </h4>
        <dl className="space-y-2 text-sm">
          <DetailRow label="Type" value={lead.project.jobType} />
          <DetailRow label="Property" value={lead.project.propertyType} />
          {lead.project.budget && <DetailRow label="Budget" value={lead.project.budget} />}
          {lead.project.projectSize && (
            <DetailRow label="Size" value={lead.project.projectSize} />
          )}
          {lead.project.squareMetres != null && (
            <DetailRow label="Area" value={`${lead.project.squareMetres} m²`} />
          )}
          {lead.project.urgency && <DetailRow label="Timeline" value={lead.project.urgency} />}
          {lead.project.description && (
            <DetailRow label="Description" value={lead.project.description} />
          )}
        </dl>
      </div>

      {/* Score + photos */}
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-accent">
          Lead Score — {lead.score.total}/100
        </h4>
        <p className="mb-1 text-sm font-medium text-white">
          {PRIORITY_LABELS[lead.score.priority]}
        </p>
        <p className="mb-4 text-xs text-white/50">{lead.score.recommendation}</p>

        <div className="grid gap-2 sm:grid-cols-2">
          {Object.values(lead.score.factors).map((f) => (
            <div key={f.label} className="rounded-lg bg-surface-elevated px-3 py-2">
              <div className="flex justify-between text-xs">
                <span className="text-white/40">{f.label}</span>
                <span className="font-medium text-white">
                  {f.score}/{f.max}
                </span>
              </div>
              <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${(f.score / f.max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {lead.photos.length > 0 && (
          <div className="mt-5">
            <h4 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
              <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />
              Uploaded Photos ({lead.photos.length})
            </h4>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {lead.photos.map((photo) => (
                <a
                  key={photo.filename}
                  href={`/api/admin/photos/${lead.id}/${photo.filename}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block aspect-square overflow-hidden rounded-lg border border-surface-border"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/api/admin/photos/${lead.id}/${photo.filename}`}
                    alt={photo.originalName}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2 lg:hidden">
          <a
            href={`tel:${lead.contact.phone}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent-muted px-3 py-2 text-xs font-medium text-accent"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            Call
          </a>
          <a
            href={`mailto:${lead.contact.email}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-2 text-xs font-medium text-white/70"
          >
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            Email
          </a>
          <select
            value={lead.status}
            onChange={(e) => onStatusChange(lead.id, e.target.value as LeadStatus)}
            className="rounded-lg border border-surface-border bg-surface-elevated px-3 py-2 text-xs text-white"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  children,
  icon: Icon,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex gap-2">
      <dt className="w-28 shrink-0 text-white/40">{label}</dt>
      <dd className="flex items-center gap-1.5 text-white/80">
        {Icon && <Icon className="h-3.5 w-3.5 text-accent" aria-hidden="true" />}
        {children ?? value}
      </dd>
    </div>
  );
}
