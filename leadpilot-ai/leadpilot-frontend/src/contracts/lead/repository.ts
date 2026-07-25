import { LeadEntity, LeadFilterState } from "@/domain/lead/types";
import { LeadFormInput } from "@/lib/validations/lead-form";

export interface LeadRepository {
  getLeads(filters?: Partial<LeadFilterState>): Promise<LeadEntity[]>;
  getLeadById(id: string): Promise<LeadEntity | null>;
  createLead(input: LeadFormInput): Promise<LeadEntity>;
  updateLead(id: string, input: LeadFormInput): Promise<LeadEntity>;
  deleteLead(id: string): Promise<boolean>;
  bulkDeleteLeads(ids: string[]): Promise<boolean>;
}
