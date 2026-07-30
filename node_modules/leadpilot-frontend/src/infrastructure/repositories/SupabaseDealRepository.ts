import { DealRepository } from "@/contracts/deal/repository";
import { DealEntity, DealFilterState, DealStage } from "@/domain/deal/types";
import { DealFormInput } from "@/lib/validations/deal-form";
import { supabase } from "@/lib/supabase/client";
import { platformAuditLogger } from "@/platform/audit";

export class SupabaseDealRepository implements DealRepository {
  async getDeals(filters?: Partial<DealFilterState>): Promise<DealEntity[]> {
    const { data, error } = await supabase
      .from("deals")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[SupabaseDealRepository] getDeals error:", error.message);
      throw new Error(`Database error fetching deals: ${error.message}`);
    }

    const mapped: DealEntity[] = (data || []).map((item) => ({
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

    return this.applyFilters(mapped, filters);
  }

  async getDealById(id: string): Promise<DealEntity | null> {
    const { data, error } = await supabase
      .from("deals")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error(`[SupabaseDealRepository] getDealById(${id}) error:`, error.message);
      throw new Error(`Database error fetching deal ${id}: ${error.message}`);
    }

    if (!data) return null;

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

  async createDeal(input: DealFormInput): Promise<DealEntity> {
    const newId = `dl-${Math.floor(200 + Math.random() * 800)}`;
    const newDealRecord = {
      id: newId,
      title: input.title,
      company_name: input.companyName || "",
      contact_name: "Lead Inquiry",
      lead_id: input.relatedLeadId,
      stage: input.stage as DealStage,
      priority: input.priority || "NORMAL",
      value: input.value,
      probability: input.probability,
      assigned_agent_name: input.assignedAgentName || "Alex Morgan",
      expected_close_date: input.expectedCloseDate,
      notes: input.notes || "",
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("deals")
      .insert([newDealRecord])
      .select()
      .single();

    if (error) {
      console.error("[SupabaseDealRepository] createDeal error:", error.message);
      throw new Error(`Database error creating deal: ${error.message}`);
    }

    const createdDeal: DealEntity = {
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

    platformAuditLogger.log({
      action: "CREATE",
      entityType: "DEAL",
      entityIds: [createdDeal.id],
      payload: { event: "Deal Created", title: createdDeal.title, value: createdDeal.value, stage: createdDeal.stage },
      timestamp: new Date().toISOString(),
    });

    return createdDeal;
  }

  async updateDeal(id: string, input: DealFormInput): Promise<DealEntity> {
    const { data, error } = await supabase
      .from("deals")
      .update({
        title: input.title,
        company_name: input.companyName || "",
        stage: input.stage as DealStage,
        priority: input.priority || "NORMAL",
        value: input.value,
        probability: input.probability,
        assigned_agent_name: input.assignedAgentName || "Alex Morgan",
        expected_close_date: input.expectedCloseDate,
        notes: input.notes || "",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`[SupabaseDealRepository] updateDeal(${id}) error:`, error.message);
      throw new Error(`Database error updating deal ${id}: ${error.message}`);
    }

    const updatedDeal: DealEntity = {
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
    const { error } = await supabase.from("deals").delete().eq("id", id);

    if (error) {
      console.error(`[SupabaseDealRepository] deleteDeal(${id}) error:`, error.message);
      throw new Error(`Database error deleting deal ${id}: ${error.message}`);
    }

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

    const { data, error } = await supabase
      .from("deals")
      .update({ stage: newStage, probability: prob, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`[SupabaseDealRepository] changeStage(${id}) error:`, error.message);
      throw new Error(`Database error changing stage for deal ${id}: ${error.message}`);
    }

    const updatedDeal: DealEntity = {
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
