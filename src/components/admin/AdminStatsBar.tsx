"use client";

import type { LeadFilters, LeadStats } from "@/lib/leads/types";
import { DEFAULT_LEAD_FILTERS } from "@/lib/leads/admin-filters";
import { cn } from "@/lib/utils";
import { Bell, Flame, Inbox, TrendingUp, Users } from "lucide-react";

export type StatsFilterAction =
  | { type: "unread" }
  | { type: "hot" }
  | { type: "today" }
  | { type: "clear" };

interface AdminStatsBarProps {
  stats: LeadStats;
  filters: LeadFilters;
  onFilterAction: (action: StatsFilterAction) => void;
}

export function AdminStatsBar({
  stats,
  filters,
  onFilterAction,
}: AdminStatsBarProps) {
  const cards = [
    {
      id: "unread" as const,
      label: "Unread",
      value: stats.unread,
      icon: Bell,
      color: "text-accent",
      bg: "bg-accent-muted",
      highlight: stats.unread > 0,
      active: Boolean(filters.unreadOnly),
      clickable: true,
      hint: "Show unread only",
    },
    {
      id: "hot" as const,
      label: "Hot Leads",
      value: stats.hot,
      icon: Flame,
      color: "text-accent",
      bg: "bg-accent-muted",
      active: filters.priority === "hot",
      clickable: true,
      hint: "Filter hot priority",
    },
    {
      id: "today" as const,
      label: "New Today",
      value: stats.newToday,
      icon: TrendingUp,
      color: "text-green-400",
      bg: "bg-green-500/10",
      active: Boolean(filters.newTodayOnly),
      clickable: true,
      hint: "Show today's enquiries",
    },
    {
      id: "clear" as const,
      label: "Quote Requests",
      value: stats.total,
      sub: `${stats.quoteForm} form · ${stats.quoteAssistant} assistant`,
      icon: Inbox,
      color: "text-white/70",
      bg: "bg-white/5",
      active: false,
      clickable: true,
      hint: "Show all enquiries",
    },
    {
      id: "avg" as const,
      label: "Avg Score",
      value: stats.averageScore,
      sub: "out of 100",
      icon: Users,
      color: "text-white/70",
      bg: "bg-white/5",
      active: false,
      clickable: false,
      hint: undefined,
    },
  ];

  function handleClick(id: (typeof cards)[number]["id"]) {
    if (id === "avg") return;
    if (id === "unread") {
      onFilterAction({ type: "unread" });
      return;
    }
    if (id === "hot") {
      onFilterAction({ type: "hot" });
      return;
    }
    if (id === "today") {
      onFilterAction({ type: "today" });
      return;
    }
    onFilterAction({ type: "clear" });
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;
        const Tag = card.clickable ? "button" : "div";
        return (
          <Tag
            key={card.label}
            type={card.clickable ? "button" : undefined}
            onClick={card.clickable ? () => handleClick(card.id) : undefined}
            title={card.hint}
            className={cn(
              "rounded-xl border border-surface-border bg-surface p-4 text-left transition-all",
              card.highlight && "border-accent/40",
              card.active && "border-accent ring-1 ring-accent/40",
              card.clickable &&
                "cursor-pointer hover:border-accent/50 hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            )}
          >
            <div className="flex items-center justify-between">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg",
                  card.bg
                )}
              >
                <Icon className={cn("h-4 w-4", card.color)} aria-hidden="true" />
              </div>
              {card.highlight && (
                <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                  New
                </span>
              )}
            </div>
            <p className="mt-3 text-2xl font-bold text-white">{card.value}</p>
            <p className="text-xs text-white/50">{card.label}</p>
            {card.sub && (
              <p className="mt-0.5 text-[10px] text-white/30">{card.sub}</p>
            )}
            {card.clickable && (
              <p className="mt-2 text-[10px] font-medium text-white/25">
                {card.active ? "Active filter · click again to clear" : "Click to filter"}
              </p>
            )}
          </Tag>
        );
      })}
    </div>
  );
}

/** Apply a stats-bar action onto current filters. */
export function applyStatsFilterAction(
  filters: LeadFilters,
  action: StatsFilterAction
): LeadFilters {
  if (action.type === "clear") {
    return { ...DEFAULT_LEAD_FILTERS };
  }

  if (action.type === "unread") {
    if (filters.unreadOnly) {
      return { ...filters, unreadOnly: false };
    }
    return {
      ...DEFAULT_LEAD_FILTERS,
      unreadOnly: true,
    };
  }

  if (action.type === "hot") {
    if (filters.priority === "hot") {
      return { ...filters, priority: "all" };
    }
    return {
      ...DEFAULT_LEAD_FILTERS,
      priority: "hot",
    };
  }

  // today
  if (filters.newTodayOnly) {
    return { ...filters, newTodayOnly: false };
  }
  return {
    ...DEFAULT_LEAD_FILTERS,
    newTodayOnly: true,
  };
}
