import { MeetingPrep } from "@/domain/copilot/CopilotTypes";

export class MeetingPrepEngine {
  public static async generatePrep(leadId: string, leadName?: string): Promise<MeetingPrep> {
    const name = leadName || "High-Value Prospect";

    return {
      leadId,
      leadName: name,
      leadOverview: `${name} is preparing to execute a commercial acquisition. Key priorities include cap rate ROI, tenant occupancy stability, and multi-year lease terms.`,
      timelineHighlights: [
        "2026-07-20: Initial inquiry submitted via Website Landing Page",
        "2026-07-22: WhatsApp discovery chat completed (Target budget: $4M)",
        "2026-07-25: NDA signed and preliminary offering memorandum sent",
      ],
      previousInteractionsCount: 5,
      openTasks: [
        "Confirm zoning compliance certificate for Property #104",
        "Prepare draft letter of intent (LOI)",
      ],
      recommendedTalkingPoints: [
        "Highlight 8.2% projected net yield based on current leases",
        "Discuss flexible closing timeline (30 vs 60 days)",
        "Offer complimentary 1-year property management onboarding package",
      ],
      generatedAt: new Date().toISOString(),
    };
  }
}
