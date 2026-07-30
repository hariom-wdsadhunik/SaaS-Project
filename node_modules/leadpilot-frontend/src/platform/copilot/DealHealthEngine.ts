import { DealHealthPrediction } from "@/domain/copilot/CopilotTypes";

export class DealHealthEngine {
  public static async predictHealth(dealId: string, title?: string, _value?: number): Promise<DealHealthPrediction> {
    const dealTitle = title || "Commercial Property Acquisition";

    return {
      dealId,
      dealTitle,
      closingProbability: 82,
      healthGrade: "A",
      missingInformation: [
        "Updated corporate tax clearance certificate",
      ],
      riskIndicators: [
        "Decision timeline extended by 5 business days",
      ],
      recommendedNextAction: "Send AI-generated executive summary to C-suite sponsor to lock closing date.",
    };
  }

  public static async predictAllDeals(): Promise<DealHealthPrediction[]> {
    return [
      await this.predictHealth("deal-101", "Downtown Office Tower", 4500000),
      {
        dealId: "deal-102",
        dealTitle: "Suburban Medical Center",
        closingProbability: 45,
        healthGrade: "D",
        missingInformation: ["Environmental Impact Assessment", "Financing pre-approval letter"],
        riskIndicators: ["No client response to last 2 email follow-ups"],
        recommendedNextAction: "Trigger urgent AI WhatsApp re-engagement campaign",
      },
      {
        dealId: "deal-103",
        dealTitle: "Logistics Hub Warehouse",
        closingProbability: 91,
        healthGrade: "A",
        missingInformation: [],
        riskIndicators: [],
        recommendedNextAction: "Prepare final closing documents in Document Center",
      },
    ];
  }
}
