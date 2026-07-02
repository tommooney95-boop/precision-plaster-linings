"use client";

import { AdminLeadRow } from "@/components/admin/AdminLeadRow";
import { AdminStatsBar } from "@/components/admin/AdminStatsBar";
import { AdminToolbar } from "@/components/admin/AdminToolbar";
import { DashboardLogin } from "@/components/dashboard/DashboardLogin";
import { siteConfig } from "@/lib/site-config";
import type { Lead, LeadFilters, LeadStats, LeadStatus } from "@/lib/leads/types";
import { cn } from "@/lib/utils";
import { LogOut, RefreshCw, Shield } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const DEFAULT_FILTERS: LeadFilters = {
  search: "",
  priority: "all",
  status: "all",
  source: "all",
  projectType: "all",
  unreadOnly: false,
};

function buildQueryString(filters: LeadFilters): string {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.priority && filters.priority !== "all") params.set("priority", filters.priority);
  if (filters.status && filters.status !== "all") params.set("status", filters.status);
  if (filters.source && filters.source !== "all") params.set("source", filters.source);
  if (filters.projectType && filters.projectType !== "all") params.set("projectType", filters.projectType);
  if (filters.unreadOnly) params.set("unread", "true");
  return params.toString();
}

export function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [projectTypes, setProjectTypes] = useState<string[]>([]);
  const [filters, setFilters] = useState<LeadFilters>(DEFAULT_FILTERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const checkAuth = useCallback(async () => {
    const res = await fetch("/api/dashboard/auth");
    const data = await res.json();
    setAuthenticated(data.authenticated);
  }, []);

  const loadLeads = useCallback(async (currentFilters: LeadFilters) => {
    setLoading(true);
    try {
      const qs = buildQueryString(currentFilters);
      const res = await fetch(`/api/admin/leads?${qs}`);
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setLeads(data.leads);
      setStats(data.stats);
      setProjectTypes(data.projectTypes ?? []);
    } catch {
      console.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!authenticated) return;
    const timer = setTimeout(() => loadLeads(filters), filters.search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [authenticated, filters, loadLeads]);

  async function handleLogout() {
    await fetch("/api/dashboard/auth", { method: "DELETE" });
    setAuthenticated(false);
    setLeads([]);
    setStats(null);
  }

  async function handleStatusChange(id: string, status: LeadStatus) {
    const res = await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const { lead } = await res.json();
      setLeads((prev) => prev.map((l) => (l.id === id ? lead : l)));
    }
  }

  async function handleMarkRead(id: string) {
    const existing = leads.find((l) => l.id === id);
    const wasUnread = existing && !existing.read;

    const res = await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: true }),
    });
    if (res.ok) {
      const { lead } = await res.json();
      setLeads((prev) => prev.map((l) => (l.id === id ? lead : l)));
      if (wasUnread) {
        setStats((s) => (s ? { ...s, unread: Math.max(0, s.unread - 1) } : s));
      }
    }
  }

  async function handleExport() {
    setExporting(true);
    try {
      const qs = buildQueryString(filters);
      const res = await fetch(`/api/admin/export?${qs}`);
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  if (authenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <RefreshCw className="h-6 w-6 animate-spin text-white/30" />
      </div>
    );
  }

  if (!authenticated) {
    return <DashboardLogin onSuccess={() => setAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-surface-border bg-surface/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <Shield className="h-4 w-4 text-white" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white sm:text-base">Admin Dashboard</h1>
              <p className="hidden text-xs text-white/40 sm:block">{siteConfig.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {stats && stats.unread > 0 && (
              <span className="mr-2 rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-white">
                {stats.unread} unread
              </span>
            )}
            <button
              type="button"
              onClick={() => loadLeads(filters)}
              disabled={loading}
              className="rounded-lg p-2 text-white/50 hover:bg-surface-elevated hover:text-white disabled:opacity-50"
              aria-label="Refresh"
            >
              <RefreshCw className={cn("h-5 w-5", loading && "animate-spin")} />
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/50 hover:bg-surface-elevated hover:text-white"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {stats && <AdminStatsBar stats={stats} />}

        <div className="mt-6">
          <AdminToolbar
            filters={filters}
            projectTypes={projectTypes}
            onFiltersChange={setFilters}
            onExport={handleExport}
            exporting={exporting}
          />
        </div>

        {/* Table header — desktop */}
        <div className="mt-4 hidden px-4 text-xs font-medium uppercase tracking-wider text-white/30 lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_100px_80px_90px_100px_40px] lg:gap-4">
          <span>Customer</span>
          <span>Project</span>
          <span>Priority</span>
          <span>Score</span>
          <span>Source</span>
          <span>Status</span>
          <span />
        </div>

        <div className="mt-2 space-y-2">
          {leads.length === 0 ? (
            <div className="rounded-xl border border-dashed border-surface-border py-16 text-center">
              <p className="text-white/50">No enquiries found</p>
              <p className="mt-1 text-sm text-white/30">
                {filters.search || filters.unreadOnly
                  ? "Try adjusting your search or filters"
                  : "New quote requests will appear here automatically"}
              </p>
            </div>
          ) : (
            leads.map((lead) => (
              <AdminLeadRow
                key={lead.id}
                lead={lead}
                selected={selectedId === lead.id}
                onSelect={(l) => setSelectedId(l.id)}
                onStatusChange={handleStatusChange}
                onMarkRead={handleMarkRead}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
