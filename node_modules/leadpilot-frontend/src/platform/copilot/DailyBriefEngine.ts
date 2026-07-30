import { DailyBrief } from "@/domain/copilot/CopilotTypes";

export class DailyBriefEngine {
  public static async generateDailyBrief(userId: string = "usr_agent"): Promise<DailyBrief> {
    const today = new Date().toISOString().split("T")[0];

    return {
      userId,
      date: today,
      highPriorityLeads: [
        { id: "lead-101", name: "Metro Commercial Group", score: 94, reason: "High budget ($5M), urgent timeline" },
        { id: "lead-102", name: "Apex Retail Ventures", score: 88, reason: "Requested immediate walkthrough" },
      ],
      dealsAtRisk: [
        { id: "deal-201", title: "Downtown Plaza Acquisition", value: 4200000, riskFactor: "No contact in 7 days" },
        { id: "deal-202", title: "Industrial Park Lease", value: 1800000, riskFactor: "Competitor bid submitted" },
      ],
      tasksDueToday: [
        { id: "tsk-301", title: "Send revised LOI to Metro Commercial", priority: "HIGH" },
        { id: "tsk-302", title: "Follow up on HVAC inspection report", priority: "MEDIUM" },
      ],
      suggestedActions: [
        "Send personalized AI WhatsApp message to Metro Commercial Group",
        "Schedule internal deal review for Downtown Plaza Acquisition",
        "Review new high-scoring lead leads.json imports",
      ],
    };
  }
}
