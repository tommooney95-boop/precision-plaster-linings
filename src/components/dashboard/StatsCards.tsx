import type { LeadStats } from "@/lib/leads/types";
import { cn } from "@/lib/utils";
import { Flame, TrendingUp, Users, Zap } from "lucide-react";

interface StatsCardsProps {
  stats: LeadStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: "Hot Leads",
      value: stats.hot,
      icon: Flame,
      color: "text-accent",
      bg: "bg-accent-muted",
      highlight: stats.hot > 0,
    },
    {
      label: "High Priority",
      value: stats.high,
      icon: Zap,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
    },
    {
      label: "New Today",
      value: stats.newToday,
      icon: TrendingUp,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      label: "Total Enquiries",
      value: stats.total,
      sub: stats.total > 0 ? `Avg score ${stats.averageScore}` : undefined,
      icon: Users,
      color: "text-white/70",
      bg: "bg-white/5",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={cn(
              "rounded-2xl border border-surface-border bg-surface p-5",
              card.highlight && "border-accent/40 shadow-glow"
            )}
          >
            <div className="flex items-center justify-between">
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", card.bg)}>
                <Icon className={cn("h-5 w-5", card.color)} aria-hidden="true" />
              </div>
              {card.highlight && (
                <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-white">
                  Action needed
                </span>
              )}
            </div>
            <p className="mt-4 text-3xl font-bold text-white">{card.value}</p>
            <p className="text-sm text-white/50">{card.label}</p>
            {card.sub && (
              <p className="mt-1 text-xs text-white/30">{card.sub}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
