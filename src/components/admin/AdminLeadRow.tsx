"use client";

import {
  formatDateTime,
  getTimeAgo,
} from "@/lib/leads/admin-filters";
import type { Lead, LeadStatus } from "@/lib/leads/types";
import { PRIORITY_COLORS, PRIORITY_LABELS } from "@/lib/leads/scoring";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  ImageIcon,
  Mail,
  MapPin,
  Phone,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";

interface AdminLeadRowProps {
  lead: Lead;
  onSelect: (lead: Lead) => void;
  onStatusChange: (id: string, status: LeadStatus) => void;
  onMarkRead: (id: string) => void;
  onSendReviewRequest?: (id: string) => void;
  selected: boolean;
  defaultExpanded?: boolean;
}

const STATUS_OPTIONS: LeadStatus[] = [
  "new",
  "contacted",
  "quoted",
  "won",
  "completed",
  "lost",
];

const STATUS_CHIP: Record<LeadStatus, string> = {
  new: "border-accent/40 bg-accent/10 text-accent",
  contacted: "border-blue-500/40 bg-blue-500/10 text-blue-300",
  quoted: "border-yellow-500/40 bg-yellow-500/10 text-yellow-200",
  won: "border-green-500/40 bg-green-500/10 text-green-300",
  completed: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  lost: "border-white/20 bg-white/5 text-white/50",
};

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

function StatusChip({ status }: { status: LeadStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase",
        STATUS_CHIP[status]
      )}
    >
      {status}
    </span>
  );
}

export function AdminLeadRow({
  lead,
  onSelect,
  onStatusChange,
  onMarkRead,
  onSendReviewRequest,
  selected,
  defaultExpanded = false,
}: AdminLeadRowProps) {
  const [expanded, setExpanded] = useState(defaultExpanded || selected);
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    setTimeAgo(getTimeAgo(new Date(lead.createdAt)));
  }, [lead.createdAt]);

  useEffect(() => {
    if (selected || defaultExpanded) setExpanded(true);
  }, [selected, defaultExpanded]);

  function openDetail() {
    onSelect(lead);
    setExpanded(true);
    if (!lead.read) onMarkRead(lead.id);
  }

  function toggleExpand(e?: React.MouseEvent) {
    e?.stopPropagation();
    const next = !expanded;
    setExpanded(next);
    onSelect(lead);
    if (next && !lead.read) onMarkRead(lead.id);
  }

  return (
    <div
      id={`lead-${lead.id}`}
      className={cn(
        "rounded-xl border bg-surface transition-all",
        !lead.read && "border-accent/30 bg-accent/[0.03]",
        selected ? "border-accent/50" : "border-surface-border"
      )}
    >
      {/* Desktop table row */}
      <div
        className="hidden cursor-pointer items-center gap-4 px-4 py-3 lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_100px_80px_90px_100px_40px]"
        onClick={openDetail}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && openDetail()}
      >
        <div className="flex min-w-0 items-center gap-2">
          {!lead.read && (
            <span className="h-2 w-2 shrink-0 rounded-full bg-accent" aria-label="Unread" />
          )}
          <div className="min-w-0">
            <p className="truncate font-medium text-white">{lead.contact.fullName}</p>
            <p className="truncate text-xs text-white/40">
              {lead.contact.email}
              {timeAgo ? ` · ${timeAgo}` : ""}
            </p>
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
          onClick={toggleExpand}
          className="text-white/30 hover:text-white"
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile card */}
      <div className="p-4 lg:hidden">
        <button
          type="button"
          className="flex w-full items-start justify-between gap-3 text-left"
          onClick={toggleExpand}
        >
          <div className="flex min-w-0 items-start gap-2">
            {!lead.read && (
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
            )}
            <div className="min-w-0">
              <p className="font-medium text-white">{lead.contact.fullName}</p>
              <p className="text-sm text-white/50">{lead.project.jobType}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <StatusChip status={lead.status} />
                {timeAgo && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-white/35">
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    {timeAgo}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <ScoreBadge score={lead.score.total} />
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase",
                PRIORITY_COLORS[lead.score.priority]
              )}
            >
              {lead.score.priority}
            </span>
            {expanded ? (
              <ChevronUp className="mt-1 h-4 w-4 text-white/30" />
            ) : (
              <ChevronDown className="mt-1 h-4 w-4 text-white/30" />
            )}
          </div>
        </button>

        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href={`tel:${lead.contact.phone.replace(/\s/g, "")}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-accent-muted px-3 py-2.5 text-xs font-semibold text-accent sm:flex-none"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            Call
          </a>
          <a
            href={`mailto:${lead.contact.email}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white/5 px-3 py-2.5 text-xs font-semibold text-white/70 sm:flex-none"
          >
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            Email
          </a>
          <select
            value={lead.status}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onStatusChange(lead.id, e.target.value as LeadStatus)}
            className="min-w-[7.5rem] flex-1 rounded-lg border border-surface-border bg-surface-elevated px-3 py-2.5 text-xs text-white sm:flex-none"
            aria-label="Lead status"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {expanded && (
        <AdminLeadDetail
          lead={lead}
          onSendReviewRequest={onSendReviewRequest}
          className="border-t border-surface-border"
        />
      )}
    </div>
  );
}

interface AdminLeadDetailProps {
  lead: Lead;
  onSendReviewRequest?: (id: string) => void;
  className?: string;
}

export function AdminLeadDetail({
  lead,
  onSendReviewRequest,
  className,
}: AdminLeadDetailProps) {
  return (
    <div className={cn("grid gap-6 p-4 md:p-5 lg:grid-cols-2", className)}>
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-accent">
          Customer Details
        </h4>
        <dl className="space-y-2 text-sm">
          <DetailRow label="Name" value={lead.contact.fullName} />
          <DetailRow label="Phone">
            <a href={`tel:${lead.contact.phone.replace(/\s/g, "")}`} className="text-accent hover:underline">
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
          <DetailRow label="Submitted" value={`${formatDateTime(lead.createdAt)} (${getTimeAgo(new Date(lead.createdAt))})`} />
          <DetailRow label="Updated" value={formatDateTime(lead.updatedAt)} />
          <DetailRow
            label="Source"
            value={lead.source === "quote-form" ? "Quote form" : "Quote assistant"}
          />
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
          {lead.project.waterDamage != null && (
            <DetailRow
              label="Water damage"
              value={lead.project.waterDamage ? "Yes" : "No"}
            />
          )}
          {lead.project.commercialBusinessName && (
            <DetailRow
              label="Business"
              value={lead.project.commercialBusinessName}
            />
          )}
          {lead.project.commercialFloorCount && (
            <DetailRow
              label="Floors"
              value={lead.project.commercialFloorCount}
            />
          )}
          {lead.project.description && (
            <DetailRow label="Description" value={lead.project.description} />
          )}
        </dl>
      </div>

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
              {f.detail && (
                <p className="mt-1.5 text-[11px] leading-snug text-white/35">{f.detail}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-xl border border-surface-border bg-surface-elevated p-4">
          <h4 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
            <Star className="h-3.5 w-3.5" aria-hidden="true" />
            Job complete &amp; review
          </h4>
          {lead.reviewRequestSentAt ? (
            <p className="text-xs text-white/60">
              Review request sent{" "}
              {formatDateTime(lead.reviewRequestSentAt)}
              {" "}(email and/or SMS)
            </p>
          ) : (
            <p className="text-xs text-white/50">
              Set status to <strong className="text-white/70">completed</strong> to
              automatically send the customer a Google review link by email
              (and SMS if Twilio is connected).
            </p>
          )}
          {onSendReviewRequest && !lead.reviewRequestSentAt && (
            <button
              type="button"
              onClick={() => onSendReviewRequest(lead.id)}
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-accent px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-accent-hover"
            >
              <Star className="h-3.5 w-3.5" aria-hidden="true" />
              Send review request now
            </button>
          )}
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

        <div className="mt-4 hidden flex-wrap gap-2 lg:flex">
          <a
            href={`tel:${lead.contact.phone.replace(/\s/g, "")}`}
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
