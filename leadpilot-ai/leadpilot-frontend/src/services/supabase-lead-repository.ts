import { LeadRepository } from "@/contracts/lead/repository";
import { LeadEntity, LeadFilterState } from "@/domain/lead/types";
import { LeadFormInput } from "@/lib/validations/lead-form";
import { supabase } from "@/lib/supabase/client";

const INITIAL_SEED_LEADS: LeadEntity[] = [
  {
    id: "ld-101",
    fullName: "John Doe",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    email: "john.doe@example.com",
    phone: "+1 (555) 234-5678",
    source: "WhatsApp Business API",
    status: "QUALIFIED",
    aiPropensityScore: 88,
    budgetMin: 1000000,
    budgetMax: 1500000,
    assignedBrokerName: "Alex Morgan",
    createdAt: "2026-07-20T10:30:00Z",
  },
  {
    id: "ld-102",
    fullName: "Sarah Jenkins",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
    email: "sarah.jenkins@agency.io",
    phone: "+1 (555) 876-5432",
    source: "Meta / IG Lead Ads",
    status: "NEW",
    aiPropensityScore: 64,
    budgetMin: 750000,
    budgetMax: 900000,
    assignedBrokerName: "Sarah Jenkins",
    createdAt: "2026-07-21T14:15:00Z",
  },
  {
    id: "ld-103",
    fullName: "Alexander Montgomery-Wellington III",
    email: "alexander.wellington.investments@estate-corp.com",
    phone: "+1 (555) 999-0011",
    source: "Client Referrals",
    status: "QUALIFIED",
    aiPropensityScore: 94,
    budgetMin: 2500000,
    budgetMax: 4000000,
    assignedBrokerName: "Alex Morgan",
    createdAt: "2026-07-22T09:00:00Z",
  },
  {
    id: "ld-104",
    fullName: "Michael Chen",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    email: "m.chen@techholdings.com",
    phone: "+1 (555) 444-3322",
    source: "Website Webhook",
    status: "CONTACTED",
    aiPropensityScore: 72,
    budgetMin: 1200000,
    budgetMax: 1800000,
    assignedBrokerName: "Michael Chen",
    createdAt: "2026-07-22T11:45:00Z",
  },
  {
    id: "ld-105",
    fullName: "Emily Watson",
    email: "emily.watson@designstudio.org",
    phone: "+1 (555) 111-2233",
    source: "Meta / IG Lead Ads",
    status: "NURTURING",
    aiPropensityScore: 52,
    budgetMin: 500000,
    budgetMax: 700000,
    assignedBrokerName: "Unassigned",
    createdAt: "2026-07-23T08:20:00Z",
  },
  {
    id: "ld-106",
    fullName: "David Miller",
    email: "dmiller@construction.net",
    phone: "+1 (555) 666-7788",
    source: "WhatsApp Business API",
    status: "LOST",
    aiPropensityScore: 28,
    budgetMin: 400000,
    budgetMax: 600000,
    assignedBrokerName: "Michael Chen",
    createdAt: "2026-07-18T16:00:00Z",
  },
  {
    id: "ld-107",
    fullName: "Jessica Taylor",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    email: "jtaylor@luxuryhomes.com",
    phone: "+1 (555) 333-8899",
    source: "Client Referrals",
    status: "QUALIFIED",
    aiPropensityScore: 82,
    budgetMin: 1800000,
    budgetMax: 2200000,
    assignedBrokerName: "Alex Morgan",
    createdAt: "2026-07-23T15:30:00Z",
  },
];

const STORAGE_KEY = "leadpilot_supabase_leads_store";

function getLocalStore(): LeadEntity[] {
  if (typeof window === "undefined") return INITIAL_SEED_LEADS;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_LEADS));
    return INITIAL_SEED_LEADS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_SEED_LEADS;
  }
}

function setLocalStore(leads: LeadEntity[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  }
}

export class SupabaseLeadRepository implements LeadRepository {
  async getLeads(filters?: Partial<LeadFilterState>): Promise<LeadEntity[]> {
    try {
      const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped: LeadEntity[] = data.map((item) => ({
          id: item.id,
          fullName: item.full_name,
          email: item.email,
          phone: item.phone,
          source: item.source,
          status: item.status,
          aiPropensityScore: item.ai_propensity_score,
          budgetMin: Number(item.budget_min),
          budgetMax: Number(item.budget_max),
          assignedBrokerName: item.assigned_broker_name,
          avatarUrl: item.avatar_url,
          createdAt: item.created_at,
        }));
        setLocalStore(mapped);
        return this.applyFilters(mapped, filters);
      }
    } catch {
      // Fallback to persistent client store if Supabase endpoint is unavailable
    }

    const localLeads = getLocalStore();
    return this.applyFilters(localLeads, filters);
  }

  async getLeadById(id: string): Promise<LeadEntity | null> {
    try {
      const { data, error } = await supabase.from("leads").select("*").eq("id", id).single();
      if (!error && data) {
        return {
          id: data.id,
          fullName: data.full_name,
          email: data.email,
          phone: data.phone,
          source: data.source,
          status: data.status,
          aiPropensityScore: data.ai_propensity_score,
          budgetMin: Number(data.budget_min),
          budgetMax: Number(data.budget_max),
          assignedBrokerName: data.assigned_broker_name,
          avatarUrl: data.avatar_url,
          createdAt: data.created_at,
        };
      }
    } catch {
      // Fallback
    }

    const localLeads = getLocalStore();
    return localLeads.find((l) => l.id === id) || null;
  }

  async createLead(input: LeadFormInput): Promise<LeadEntity> {
    const newId = `ld-${Math.floor(100 + Math.random() * 900)}`;
    const newLead: LeadEntity = {
      id: newId,
      fullName: input.fullName,
      email: input.email || "",
      phone: input.phone || "",
      source: input.source,
      status: input.status,
      aiPropensityScore: 50,
      budgetMin: input.budgetMin || 0,
      budgetMax: input.budgetMax || 0,
      assignedBrokerName: input.assignedBrokerName || "Unassigned",
      createdAt: new Date().toISOString(),
    };

    try {
      await supabase.from("leads").insert([
        {
          id: newLead.id,
          full_name: newLead.fullName,
          email: newLead.email,
          phone: newLead.phone,
          source: newLead.source,
          status: newLead.status,
          ai_propensity_score: newLead.aiPropensityScore,
          budget_min: newLead.budgetMin,
          budget_max: newLead.budgetMax,
          assigned_broker_name: newLead.assignedBrokerName,
          created_at: newLead.createdAt,
        },
      ]);
    } catch {
      // Fallback
    }

    const current = getLocalStore();
    const updated = [newLead, ...current];
    setLocalStore(updated);
    return newLead;
  }

  async updateLead(id: string, input: LeadFormInput): Promise<LeadEntity> {
    const existing = await this.getLeadById(id);
    const updatedLead: LeadEntity = {
      id,
      fullName: input.fullName,
      email: input.email || "",
      phone: input.phone || "",
      source: input.source,
      status: input.status,
      aiPropensityScore: existing?.aiPropensityScore || 75,
      budgetMin: input.budgetMin || 0,
      budgetMax: input.budgetMax || 0,
      assignedBrokerName: input.assignedBrokerName || "Unassigned",
      createdAt: existing?.createdAt || new Date().toISOString(),
    };

    try {
      await supabase
        .from("leads")
        .update({
          full_name: updatedLead.fullName,
          email: updatedLead.email,
          phone: updatedLead.phone,
          source: updatedLead.source,
          status: updatedLead.status,
          budget_min: updatedLead.budgetMin,
          budget_max: updatedLead.budgetMax,
          assigned_broker_name: updatedLead.assignedBrokerName,
        })
        .eq("id", id);
    } catch {
      // Fallback
    }

    const current = getLocalStore();
    const updated = current.map((l) => (l.id === id ? updatedLead : l));
    setLocalStore(updated);
    return updatedLead;
  }

  async deleteLead(id: string): Promise<boolean> {
    try {
      await supabase.from("leads").delete().eq("id", id);
    } catch {
      // Fallback
    }

    const current = getLocalStore();
    const updated = current.filter((l) => l.id !== id);
    setLocalStore(updated);
    return true;
  }

  async bulkDeleteLeads(ids: string[]): Promise<boolean> {
    try {
      await supabase.from("leads").delete().in("id", ids);
    } catch {
      // Fallback
    }

    const current = getLocalStore();
    const updated = current.filter((l) => !ids.includes(l.id));
    setLocalStore(updated);
    return true;
  }

  async changeStatus(id: string, status: LeadEntity["status"]): Promise<LeadEntity> {
    const existing = await this.getLeadById(id);
    if (!existing) throw new Error("Lead not found");
    return this.updateLead(id, {
      fullName: existing.fullName,
      email: existing.email,
      phone: existing.phone,
      source: existing.source,
      status,
      budgetMin: existing.budgetMin,
      budgetMax: existing.budgetMax,
      assignedBrokerName: existing.assignedBrokerName,
    });
  }

  async assignBroker(id: string, brokerName: string): Promise<LeadEntity> {
    const existing = await this.getLeadById(id);
    if (!existing) throw new Error("Lead not found");
    return this.updateLead(id, {
      fullName: existing.fullName,
      email: existing.email,
      phone: existing.phone,
      source: existing.source,
      status: existing.status,
      budgetMin: existing.budgetMin,
      budgetMax: existing.budgetMax,
      assignedBrokerName: brokerName,
    });
  }

  private applyFilters(leads: LeadEntity[], filters?: Partial<LeadFilterState>): LeadEntity[] {
    if (!filters) return leads;
    return leads.filter((lead) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchesName = lead.fullName.toLowerCase().includes(q);
        const matchesEmail = lead.email.toLowerCase().includes(q);
        const matchesPhone = lead.phone.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesPhone) return false;
      }
      if (filters.status && lead.status !== filters.status) return false;
      if (filters.source && lead.source !== filters.source) return false;
      if (filters.agent && lead.assignedBrokerName !== filters.agent) return false;
      return true;
    });
  }
}

export const supabaseLeadRepository = new SupabaseLeadRepository();
