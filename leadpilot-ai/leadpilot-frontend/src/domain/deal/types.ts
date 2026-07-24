export type DealStage = "NEW" | "QUALIFIED" | "PROPOSAL_SENT" | "NEGOTIATION" | "WON" | "LOST";
export type DealPriority = "URGENT" | "HIGH" | "NORMAL" | "LOW";

export interface DealEntity {
  id: string;
  title: string;
  companyName: string;
  contactName: string;
  value: number;
  stage: DealStage;
  priority: DealPriority;
  probability: number;
  assignedAgentName: string;
  agentAvatarUrl?: string;
  expectedCloseDate: string;
  createdAt: string;
}

export interface DealFilterState {
  search: string;
  stage: string;
  agent: string;
  priority: string;
}
