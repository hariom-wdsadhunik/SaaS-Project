import { DealRepository } from "@/contracts/deal/repository";
import { DealEntity, DealFilterState, DealStage } from "@/domain/deal/types";
import { DealFormInput } from "@/lib/validations/deal-form";
import { supabase } from "@/lib/supabase/client";
import { platformAuditLogger } from "@/platform/audit";

const INITIAL_SEED_DEALS: DealEntity[] = [
  {
    id: "dl-201",
    title: "Penthouse Acquisition — Palm Jumeirah",
    companyName: "Emaar Properties PJSC",
    contactName: "Alexander Wellington",
    value: 3500000,
    stage: "NEW",
    priority: "URGENT",
    probability: 30,
    assignedAgentName: "Alex Morgan",
    agentAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    expectedCloseDate: "2026-08-30",
    createdAt: "2026-07-20T10:00:00Z",
  },
  {
    id: "dl-202",
    title: "Commercial Complex Expansion",
    companyName: "TechHoldings International",
    contactName: "Michael Chen",
    value: 1800000,
    stage: "QUALIFIED",
    priority: "HIGH",
    probability: 50,
    assignedAgentName: "Michael Chen",
    agentAvatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    expectedCloseDate: "2026-09-15",
    createdAt: "2026-07-21T11:30:00Z",
  },
  {
    id: "dl-203",
    title: "Luxury Villa Portfolio Sale",
    companyName: "Jenkins Design Studio",
    contactName: "Sarah Jenkins",
    value: 2400000,
    stage: "PROPOSAL_SENT",
    priority: "HIGH",
    probability: 70,
    assignedAgentName: "Sarah Jenkins",
    agentAvatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
    expectedCloseDate: "2026-08-20",
    createdAt: "2026-07-22T09:15:00Z",
  },
  {
    id: "dl-204",
    title: "Waterfront Condominium Buyout",
    companyName: "Watson Real Estate Ltd",
    contactName: "Emily Watson",
    value: 4200000,
    stage: "NEGOTIATION",
    priority: "URGENT",
    probability: 85,
    assignedAgentName: "Alex Morgan",
    agentAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    expectedCloseDate: "2026-08-10",
    createdAt: "2026-07-23T14:45:00Z",
  },
  {
    id: "dl-205",
    title: "Downtown Office Tower Lease",
    companyName: "Global Asset Management",
    contactName: "Jessica Taylor",
    value: 1250000,
    stage: "WON",
    priority: "NORMAL",
    probability: 100,
    assignedAgentName: "Alex Morgan",
    agentAvatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    expectedCloseDate: "2026-07-28",
    createdAt: "2026-07-18T16:20:00Z",
  },
  {
    id: "dl-206",
    title: "Suburban Land Development Plot",
    companyName: "Miller Construction Co",
    contactName: "David Miller",
    value: 650000,
    stage: "LOST",
    priority: "LOW",
    probability: 0,
    assignedAgentName: "Michael Chen",
    expectedCloseDate: "2026-07-24",
    createdAt: "2026-07-15T08:00:00Z",
  },
];

const STORAGE_KEY = "leadpilot_supabase_deals_store";

function getLocalStore(): DealEntity[] {
  if (typeof window === "undefined") return INITIAL_SEED_DEALS;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_DEALS));
    return INITIAL_SEED_DEALS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_SEED_DEALS;
  }
}

function setLocalStore(deals: DealEntity[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(deals));
  }
}

export class SupabaseDealRepository implements DealRepository {
  async getDeals(filters?: Partial<DealFilterState>): Promise<DealEntity[]> {
    try {
      const { data, error } = await supabase.from("deals").select("*").order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped: DealEntity[] = data.map((item) => ({
          id: item.id,
          title: item.title,
          companyName: item.company_name || "",
          contactName: item.contact_name || "",
          value: Number(item.value || 0),
          stage: item.stage as DealStage,
          priority: item.priority || "NORMAL",
          probability: Number(item.probability || 50),
          assignedAgentName: item.assigned_agent_name || "Alex Morgan",
          agentAvatarUrl: item.agent_avatar_url,
          expectedCloseDate: item.expected_close_date || "",
          createdAt: item.created_at,
        }));
        setLocalStore(mapped);
        return this.applyFilters(mapped, filters);
      }
    } catch {
      // Fallback to local store
    }

    const localDeals = getLocalStore();
    return this.applyFilters(localDeals, filters);
  }

  async getDealById(id: string): Promise<DealEntity | null> {
    try {
      const { data, error } = await supabase.from("deals").select("*").eq("id", id).single();
      if (!error && data) {
        return {
          id: data.id,
          title: data.title,
          companyName: data.company_name || "",
          contactName: data.contact_name || "",
          value: Number(data.value || 0),
          stage: data.stage as DealStage,
          priority: data.priority || "NORMAL",
          probability: Number(data.probability || 50),
          assignedAgentName: data.assigned_agent_name || "Alex Morgan",
          agentAvatarUrl: data.agent_avatar_url,
          expectedCloseDate: data.expected_close_date || "",
          createdAt: data.created_at,
        };
      }
    } catch {
      // Fallback
    }

    const localDeals = getLocalStore();
    return localDeals.find((d) => d.id === id) || null;
  }

  async createDeal(input: DealFormInput): Promise<DealEntity> {
    const newId = `dl-${Math.floor(200 + Math.random() * 800)}`;
    const newDeal: DealEntity = {
      id: newId,
      title: input.title,
      companyName: input.companyName || "",
      contactName: "Lead Inquiry",
      value: input.value,
      stage: input.stage as DealStage,
      priority: input.priority || "NORMAL",
      probability: input.probability,
      assignedAgentName: input.assignedAgentName || "Alex Morgan",
      expectedCloseDate: input.expectedCloseDate,
      createdAt: new Date().toISOString(),
    };

    try {
      await supabase.from("deals").insert([
        {
          id: newDeal.id,
          title: newDeal.title,
          company_name: newDeal.companyName,
          contact_name: newDeal.contactName,
          lead_id: input.relatedLeadId,
          stage: newDeal.stage,
          priority: newDeal.priority,
          value: newDeal.value,
          probability: newDeal.probability,
          assigned_agent_name: newDeal.assignedAgentName,
          expected_close_date: newDeal.expectedCloseDate,
          notes: input.notes || "",
          created_at: newDeal.createdAt,
        },
      ]);
    } catch {
      // Fallback
    }

    const current = getLocalStore();
    const updated = [newDeal, ...current];
    setLocalStore(updated);

    platformAuditLogger.log({
      action: "CREATE",
      entityType: "DEAL",
      entityIds: [newDeal.id],
      payload: { event: "Deal Created", title: newDeal.title, value: newDeal.value, stage: newDeal.stage },
      timestamp: new Date().toISOString(),
    });

    return newDeal;
  }

  async updateDeal(id: string, input: DealFormInput): Promise<DealEntity> {
    const existing = await this.getDealById(id);
    const updatedDeal: DealEntity = {
      id,
      title: input.title,
      companyName: input.companyName || existing?.companyName || "",
      contactName: existing?.contactName || "Lead Inquiry",
      value: input.value,
      stage: input.stage as DealStage,
      priority: input.priority || existing?.priority || "NORMAL",
      probability: input.probability,
      assignedAgentName: input.assignedAgentName || existing?.assignedAgentName || "Alex Morgan",
      expectedCloseDate: input.expectedCloseDate,
      createdAt: existing?.createdAt || new Date().toISOString(),
    };

    try {
      await supabase
        .from("deals")
        .update({
          title: updatedDeal.title,
          company_name: updatedDeal.companyName,
          stage: updatedDeal.stage,
          priority: updatedDeal.priority,
          value: updatedDeal.value,
          probability: updatedDeal.probability,
          assigned_agent_name: updatedDeal.assignedAgentName,
          expected_close_date: updatedDeal.expectedCloseDate,
          notes: input.notes || "",
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
    } catch {
      // Fallback
    }

    const current = getLocalStore();
    const updated = current.map((d) => (d.id === id ? updatedDeal : d));
    setLocalStore(updated);

    platformAuditLogger.log({
      action: "UPDATE",
      entityType: "DEAL",
      entityIds: [id],
      payload: { event: "Deal Updated", title: updatedDeal.title, value: updatedDeal.value },
      timestamp: new Date().toISOString(),
    });

    return updatedDeal;
  }

  async deleteDeal(id: string): Promise<boolean> {
    try {
      await supabase.from("deals").delete().eq("id", id);
    } catch {
      // Fallback
    }

    const current = getLocalStore();
    const updated = current.filter((d) => d.id !== id);
    setLocalStore(updated);

    platformAuditLogger.log({
      action: "DELETE",
      entityType: "DEAL",
      entityIds: [id],
      payload: { event: "Deal Deleted", dealId: id },
      timestamp: new Date().toISOString(),
    });

    return true;
  }

  async changeStage(id: string, newStage: DealStage, newProbability?: number): Promise<DealEntity> {
    const existing = await this.getDealById(id);
    if (!existing) throw new Error("Deal not found");

    const prob = newProbability !== undefined ? newProbability : existing.probability;
    const updatedDeal: DealEntity = {
      ...existing,
      stage: newStage,
      probability: prob,
    };

    try {
      await supabase
        .from("deals")
        .update({ stage: newStage, probability: prob, updated_at: new Date().toISOString() })
        .eq("id", id);
    } catch {
      // Fallback
    }

    const current = getLocalStore();
    const updated = current.map((d) => (d.id === id ? updatedDeal : d));
    setLocalStore(updated);

    platformAuditLogger.log({
      action: "CHANGE_STATUS",
      entityType: "DEAL",
      entityIds: [id],
      payload: { event: "Stage Changed", previousStage: existing.stage, newStage, probability: prob },
      timestamp: new Date().toISOString(),
    });

    return updatedDeal;
  }

  private applyFilters(deals: DealEntity[], filters?: Partial<DealFilterState>): DealEntity[] {
    if (!filters) return deals;
    return deals.filter((deal) => {
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesTitle = deal.title.toLowerCase().includes(query);
        const matchesCompany = deal.companyName.toLowerCase().includes(query);
        const matchesContact = deal.contactName.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCompany && !matchesContact) return false;
      }
      if (filters.stage && deal.stage !== filters.stage) return false;
      if (filters.agent && deal.assignedAgentName !== filters.agent) return false;
      if (filters.priority && deal.priority !== filters.priority) return false;
      return true;
    });
  }
}

export const supabaseDealRepository = new SupabaseDealRepository();
