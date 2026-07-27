import { LeadSummary } from "@/domain/copilot/CopilotTypes";

export class LeadSummaryEngine {
  public static async generateSummary(leadId: string, leadData?: { name?: string; budget?: number; location?: string; status?: string }): Promise<LeadSummary> {
    const name = leadData?.name || "Target Prospect";
    const budget = leadData?.budget ? `$${leadData.budget.toLocaleString()}` : "$2,500,000";
    const location = leadData?.location || "Prime Commercial District";

    return {
      leadId,
      summary: `${name} is actively evaluating premium properties in ${location} with a declared budget of ${budget}. Decision timeline is target within 30 days.`,
      keyFacts: [
        `Pre-qualified budget: ${budget}`,
        `Preferred region: ${location}`,
        "High engagement score across WhatsApp and Email channels",
        "Decision maker: Executive Sponsor confirmed",
      ],
      risks: [
        "Competitor viewing scheduled for later this week",
        "Pending financing approval documentation",
      ],
      opportunities: [
        "Cross-sell property management suite",
        "Accelerate closing by providing exclusive architectural preview",
      ],
      generatedAt: new Date().toISOString(),
    };
  }
}
