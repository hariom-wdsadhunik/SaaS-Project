import { LeadRepository } from "@/contracts/lead/repository";
import { LeadEntity, LeadFilterState } from "@/domain/lead/types";
import { LeadFormInput } from "@/lib/validations/lead-form";
import { supabase } from "@/lib/supabase/client";

export class SupabaseLeadRepository implements LeadRepository {
  async getLeads(filters?: Partial<LeadFilterState>): Promise<LeadEntity[]> {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[SupabaseLeadRepository] getLeads error:", error.message);
      throw new Error(`Database error fetching leads: ${error.message}`);
    }

    const mapped: LeadEntity[] = (data || []).map((item) => ({
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

    return this.applyFilters(mapped, filters);
  }

  async getLeadById(id: string): Promise<LeadEntity | null> {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error(`[SupabaseLeadRepository] getLeadById(${id}) error:`, error.message);
      throw new Error(`Database error fetching lead ${id}: ${error.message}`);
    }

    if (!data) return null;

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

  async createLead(input: LeadFormInput): Promise<LeadEntity> {
    const newId = `ld-${Math.floor(100 + Math.random() * 900)}`;
    const newLeadRecord = {
      id: newId,
      full_name: input.fullName,
      email: input.email || "",
      phone: input.phone || "",
      source: input.source,
      status: input.status,
      ai_propensity_score: 50,
      budget_min: input.budgetMin || 0,
      budget_max: input.budgetMax || 0,
      assigned_broker_name: input.assignedBrokerName || "Unassigned",
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("leads")
      .insert([newLeadRecord])
      .select()
      .single();

    if (error) {
      console.error("[SupabaseLeadRepository] createLead error:", error.message);
      throw new Error(`Database error creating lead: ${error.message}`);
    }

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

  async updateLead(id: string, input: LeadFormInput): Promise<LeadEntity> {
    const { data, error } = await supabase
      .from("leads")
      .update({
        full_name: input.fullName,
        email: input.email || "",
        phone: input.phone || "",
        source: input.source,
        status: input.status,
        budget_min: input.budgetMin || 0,
        budget_max: input.budgetMax || 0,
        assigned_broker_name: input.assignedBrokerName || "Unassigned",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`[SupabaseLeadRepository] updateLead(${id}) error:`, error.message);
      throw new Error(`Database error updating lead ${id}: ${error.message}`);
    }

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

  async deleteLead(id: string): Promise<boolean> {
    const { error } = await supabase.from("leads").delete().eq("id", id);

    if (error) {
      console.error(`[SupabaseLeadRepository] deleteLead(${id}) error:`, error.message);
      throw new Error(`Database error deleting lead ${id}: ${error.message}`);
    }

    return true;
  }

  async bulkDeleteLeads(ids: string[]): Promise<boolean> {
    const { error } = await supabase.from("leads").delete().in("id", ids);

    if (error) {
      console.error("[SupabaseLeadRepository] bulkDeleteLeads error:", error.message);
      throw new Error(`Database error bulk deleting leads: ${error.message}`);
    }

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
