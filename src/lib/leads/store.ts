import { promises as fs } from "fs";
import path from "path";
import type { Lead, LeadFilters, LeadStats, LeadStatus } from "./types";
import {
  getSupabaseAdmin,
  isSupabaseConfigured,
  LEADS_TABLE,
} from "@/lib/supabase/server";

const DATA_DIR = path.join(process.cwd(), "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");

function normalizeLead(lead: Lead): Lead {
  return {
    ...lead,
    read: lead.read ?? false,
    photos: lead.photos ?? [],
  };
}

/* ── File backend (local development fallback) ──────────────────── */

async function ensureDataFile() {
  try {
    await fs.access(LEADS_FILE);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(LEADS_FILE, "[]", "utf-8");
  }
}

async function fileReadAll(): Promise<Lead[]> {
  await ensureDataFile();
  const raw = await fs.readFile(LEADS_FILE, "utf-8");
  const leads = JSON.parse(raw) as Lead[];
  return leads.map(normalizeLead);
}

async function fileWriteAll(leads: Lead[]) {
  await ensureDataFile();
  await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2), "utf-8");
}

/* ── Supabase backend (production) ──────────────────────────────── */

interface LeadRow {
  data: Lead;
}

async function supabaseReadAll(): Promise<Lead[]> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb
    .from(LEADS_TABLE)
    .select("data")
    .order("score_total", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ((data as LeadRow[]) ?? []).map((row) => normalizeLead(row.data));
}

function leadToRow(lead: Lead) {
  return {
    id: lead.id,
    source: lead.source,
    status: lead.status,
    read: lead.read,
    priority: lead.score.priority,
    score_total: lead.score.total,
    job_type: lead.project.jobType,
    created_at: lead.createdAt,
    updated_at: lead.updatedAt,
    data: lead,
  };
}

/* ── Shared read ────────────────────────────────────────────────── */

async function readAllLeads(): Promise<Lead[]> {
  return isSupabaseConfigured() ? supabaseReadAll() : fileReadAll();
}

/* ── Public API ─────────────────────────────────────────────────── */

export async function saveLead(lead: Lead): Promise<Lead> {
  const normalized = normalizeLead(lead);

  if (isSupabaseConfigured()) {
    const sb = getSupabaseAdmin();
    const { error } = await sb.from(LEADS_TABLE).insert(leadToRow(normalized));
    if (error) throw error;
    return normalized;
  }

  const leads = await fileReadAll();
  leads.unshift(normalized);
  await fileWriteAll(leads);
  return normalized;
}

export async function getLeads(): Promise<Lead[]> {
  const leads = await readAllLeads();
  return leads.sort(
    (a, b) =>
      b.score.total - a.score.total ||
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function filterLeads(leads: Lead[], filters: LeadFilters): Lead[] {
  let result = [...leads];

  if (filters.unreadOnly) {
    result = result.filter((l) => !l.read);
  }

  if (filters.priority && filters.priority !== "all") {
    result = result.filter((l) => l.score.priority === filters.priority);
  }

  if (filters.status && filters.status !== "all") {
    result = result.filter((l) => l.status === filters.status);
  }

  if (filters.source && filters.source !== "all") {
    result = result.filter((l) => l.source === filters.source);
  }

  if (filters.projectType && filters.projectType !== "all") {
    result = result.filter((l) => l.project.jobType === filters.projectType);
  }

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (l) =>
        l.contact.fullName.toLowerCase().includes(q) ||
        l.contact.email.toLowerCase().includes(q) ||
        l.contact.phone.includes(q) ||
        (l.contact.suburb?.toLowerCase().includes(q) ?? false) ||
        l.project.jobType.toLowerCase().includes(q) ||
        (l.project.description?.toLowerCase().includes(q) ?? false)
    );
  }

  return result;
}

export async function getLeadById(id: string): Promise<Lead | undefined> {
  if (isSupabaseConfigured()) {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb
      .from(LEADS_TABLE)
      .select("data")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ? normalizeLead((data as LeadRow).data) : undefined;
  }

  const leads = await fileReadAll();
  return leads.find((l) => l.id === id);
}

export async function updateLead(
  id: string,
  updates: Partial<Pick<Lead, "status" | "read">>
): Promise<Lead | null> {
  if (isSupabaseConfigured()) {
    const existing = await getLeadById(id);
    if (!existing) return null;

    const updated: Lead = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (updates.status && updates.status !== "new") {
      updated.read = true;
    }

    const sb = getSupabaseAdmin();
    const { error } = await sb
      .from(LEADS_TABLE)
      .update({
        status: updated.status,
        read: updated.read,
        updated_at: updated.updatedAt,
        data: updated,
      })
      .eq("id", id);
    if (error) throw error;
    return updated;
  }

  const leads = await fileReadAll();
  const index = leads.findIndex((l) => l.id === id);
  if (index === -1) return null;

  leads[index] = {
    ...leads[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  if (updates.status && updates.status !== "new") {
    leads[index].read = true;
  }

  await fileWriteAll(leads);
  return leads[index];
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus
): Promise<Lead | null> {
  return updateLead(id, { status });
}

export async function markLeadRead(id: string): Promise<Lead | null> {
  return updateLead(id, { read: true });
}

export async function getLeadStats(): Promise<LeadStats> {
  const leads = await readAllLeads();
  const today = new Date().toDateString();

  return {
    total: leads.length,
    unread: leads.filter((l) => !l.read).length,
    hot: leads.filter((l) => l.score.priority === "hot").length,
    high: leads.filter((l) => l.score.priority === "high").length,
    medium: leads.filter((l) => l.score.priority === "medium").length,
    low: leads.filter((l) => l.score.priority === "low").length,
    averageScore:
      leads.length > 0
        ? Math.round(leads.reduce((s, l) => s + l.score.total, 0) / leads.length)
        : 0,
    newToday: leads.filter(
      (l) => new Date(l.createdAt).toDateString() === today
    ).length,
    quoteForm: leads.filter((l) => l.source === "quote-form").length,
    quoteAssistant: leads.filter((l) => l.source === "quote-assistant").length,
  };
}

export async function getProjectTypes(): Promise<string[]> {
  const leads = await readAllLeads();
  return [...new Set(leads.map((l) => l.project.jobType))].sort();
}
