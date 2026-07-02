"use client";

import type { LeadStats } from "@/lib/leads/types";
import { cn } from "@/lib/utils";
import { Bell, Flame, Inbox, TrendingUp, Users } from "lucide-react";

interface AdminStatsBarProps {
  stats: LeadStats;
}

export function AdminStatsBar({ stats }: AdminStatsBarProps) {
  const cards = [
    {
      label: "Unread",
      value: stats.unread,
      icon: Bell,
      color: "text-accent",
      bg: "bg-accent-muted",
      highlight: stats.unread > 0,
    },
    {
      label: "Hot Leads",
      value: stats.hot,
      icon: Flame,
      color: "text-accent",
      bg: "bg-accent-muted",
    },
    {
      label: "New Today",
      value: stats.newToday,
      icon: TrendingUp,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      label: "Quote Requests",
      value: stats.total,
      sub: `${stats.quoteForm} form · ${stats.quoteAssistant} assistant`,
      icon: Inbox,
      color: "text-white/70",
      bg: "bg-white/5",
    },
    {
      label: "Avg Score",
      value: stats.averageScore,
      sub: "out of 100",
      icon: Users,
      color: "text-white/70",
      bg: "bg-white/5",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={cn(
              "rounded-xl border border-surface-border bg-surface p-4",
              card.highlight && "border-accent/40"
            )}
          >
            <div className="flex items-center justify-between">
              <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", card.bg)}>
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
            {card.sub && <p className="mt-0.5 text-[10px] text-white/30">{card.sub}</p>}
          </div>
        );
      })}
    </div>
  );
}
