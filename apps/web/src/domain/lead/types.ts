export type LeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "NURTURING" | "LOST";

export interface LeadEntity {
  id: string;
  fullName: string;
  avatarUrl?: string;
  email: string;
  phone: string;
  source: string;
  status: LeadStatus;
  aiPropensityScore: number;
  budgetMin: number;
  budgetMax: number;
  assignedBrokerName: string;
  createdAt: string;
}

export interface LeadFilterState {
  search: string;
  status: string;
  source: string;
  agent: string;
  budgetMin: string;
}
