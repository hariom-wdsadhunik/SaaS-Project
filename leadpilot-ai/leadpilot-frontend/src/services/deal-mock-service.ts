import { auditLogger } from "@/services/lead-action-service";

export type DealStage = "NEW" | "QUALIFIED" | "PROPOSAL_SENT" | "NEGOTIATION" | "WON" | "LOST";
export type DealPriority = "URGENT" | "HIGH" | "NORMAL" | "LOW";

export interface DealItem {
  id: string;
  title: string;
  companyName: string;
  contactName: string;
  value: number;
  stage: DealStage;
  priority: DealPriority;
  probability: number; // 0 - 100
  assignedAgentName: string;
  agentAvatarUrl?: string;
  expectedCloseDate: string;
  createdAt: string;
}

export const initialDealsDataset: DealItem[] = [
  {
    id: "dl-201",
    title: "Downtown Penthouse Purchase",
    companyName: "Vanguard Tech Holdings",
    contactName: "John Doe",
    value: 1450000,
    stage: "NEW",
    priority: "HIGH",
    probability: 30,
    assignedAgentName: "Alex Morgan",
    agentAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    expectedCloseDate: "2026-08-15",
    createdAt: "2026-07-20T10:00:00Z",
  },
  {
    id: "dl-202",
    title: "Marina Commercial Suite 4B",
    companyName: "Apex Logistics Ltd",
    contactName: "Sarah Jenkins",
    value: 890000,
    stage: "QUALIFIED",
    priority: "URGENT",
    probability: 60,
    assignedAgentName: "Sarah Jenkins",
    agentAvatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
    expectedCloseDate: "2026-08-10",
    createdAt: "2026-07-18T14:30:00Z",
  },
  {
    id: "dl-203",
    title: "Palm Jumeirah Luxury Villa #04",
    companyName: "Wellington Investments",
    contactName: "Alexander Montgomery III",
    value: 3800000,
    stage: "PROPOSAL_SENT",
    priority: "URGENT",
    probability: 75,
    assignedAgentName: "Alex Morgan",
    expectedCloseDate: "2026-08-30",
    createdAt: "2026-07-15T09:00:00Z",
  },
  {
    id: "dl-204",
    title: "Highland Duplex Residence",
    companyName: "Chen Design Studio",
    contactName: "Michael Chen",
    value: 1250000,
    stage: "NEGOTIATION",
    priority: "NORMAL",
    probability: 85,
    assignedAgentName: "Michael Chen",
    agentAvatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    expectedCloseDate: "2026-08-05",
    createdAt: "2026-07-12T11:20:00Z",
  },
  {
    id: "dl-205",
    title: "Central Boulevard Retail Space",
    companyName: "Urban Coffee Roasters",
    contactName: "Emily Watson",
    value: 620000,
    stage: "WON",
    priority: "NORMAL",
    probability: 100,
    assignedAgentName: "Alex Morgan",
    expectedCloseDate: "2026-07-22",
    createdAt: "2026-07-01T16:00:00Z",
  },
  {
    id: "dl-206",
    title: "Suburban Industrial Complex",
    companyName: "Miller Construction Corp",
    contactName: "David Miller",
    value: 480000,
    stage: "LOST",
    priority: "LOW",
    probability: 0,
    assignedAgentName: "Michael Chen",
    expectedCloseDate: "2026-07-19",
    createdAt: "2026-06-25T13:00:00Z",
  },
];

export const dealMockService = {
  async moveDealStage(dealId: string, newStage: DealStage): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 200));
    auditLogger.log({
      action: "CHANGE_STATUS",
      leadIds: [dealId],
      payload: { newStage, entity: "DEAL" },
      timestamp: new Date().toISOString(),
    });
    return true;
  },
};
