import {
  LeadScoreResult,
  RevenueForecastResult,
  NextBestActionItem,
  DealWinPrediction,
} from "./AiTypes";

export class AiIntelligenceEngine {
  private static mockLeadScores: LeadScoreResult[] = [
    {
      leadId: "lead-101",
      leadName: "Alexander Wright",
      company: "Apex Global Holdings",
      score: 94,
      grade: "A",
      confidence: 96,
      summary: "High engagement across email and WhatsApp with immediate budget authority.",
      contributingFactors: [
        { feature: "Recent Activity", weight: 30, description: "3 interactions in the past 24 hours" },
        { feature: "Communication Speed", weight: 25, description: "Average response time under 15 minutes" },
        { feature: "Deal Stage Alignment", weight: 20, description: "Decision maker confirmed at Proposal stage" },
      ],
      suggestedAction: "Schedule executive closing call today.",
      calculatedAt: new Date().toISOString(),
    },
    {
      leadId: "lead-102",
      leadName: "Elena Rostova",
      company: "Vanguard Tech Solutions",
      score: 78,
      grade: "B",
      confidence: 89,
      summary: "Strong product interest with pending technical review.",
      contributingFactors: [
        { feature: "Document Downloads", weight: 25, description: "Downloaded security compliance PDF" },
        { feature: "Meeting Participation", weight: 20, description: "Attended demo call with 3 team members" },
      ],
      suggestedAction: "Send technical integration whitepaper.",
      calculatedAt: new Date().toISOString(),
    },
  ];

  private static mockForecasts: RevenueForecastResult[] = [
    {
      period: "QUARTERLY",
      targetPeriodName: "Q3 2026",
      expectedRevenue: 9850000,
      bestCaseRevenue: 12400000,
      worstCaseRevenue: 8100000,
      confidenceLowerBound: 8500000,
      confidenceUpperBound: 11200000,
      confidencePercentage: 91,
      pipelineCoverageRatio: 3.4,
    },
  ];

  private static mockNextBestActions: NextBestActionItem[] = [
    {
      id: "nba-1",
      entityType: "LEAD",
      entityId: "lead-101",
      entityName: "Alexander Wright",
      priority: "CRITICAL",
      recommendedAction: "Send personalized closing contract via DocuSign",
      expectedImpact: "+$1.2M Closed-Won Revenue",
      reasoning: "Lead score is 94/100 and contract viewing detected 10 minutes ago.",
      urgency: "IMMEDIATE",
    },
    {
      id: "nba-2",
      entityType: "DEAL",
      entityId: "deal-204",
      entityName: "Enterprise Expansion Deal",
      priority: "HIGH",
      recommendedAction: "Schedule technical architecture review with CTO",
      expectedImpact: "Prevent $450K Churn Risk",
      reasoning: "No interaction logged for 7 days during technical review stage.",
      urgency: "TODAY",
    },
  ];

  private static mockDealPredictions: DealWinPrediction[] = [
    {
      dealId: "deal-201",
      dealName: "Global Infrastructure Upgrade",
      amount: 1450000,
      winProbabilityPercentage: 88,
      churnRiskPercentage: 6,
      healthStatus: "HEALTHY",
      keyDrivers: ["Multi-year commitment", "C-level sponsor signed"],
    },
    {
      dealId: "deal-204",
      dealName: "Regional Operations Rollout",
      amount: 450000,
      winProbabilityPercentage: 42,
      churnRiskPercentage: 58,
      healthStatus: "AT_RISK",
      keyDrivers: ["Delayed response time", "Key stakeholder turnover"],
    },
  ];

  public static getLeadScores(): LeadScoreResult[] {
    return this.mockLeadScores;
  }

  public static getRevenueForecasts(): RevenueForecastResult[] {
    return this.mockForecasts;
  }

  public static getNextBestActions(): NextBestActionItem[] {
    return this.mockNextBestActions;
  }

  public static getDealPredictions(): DealWinPrediction[] {
    return this.mockDealPredictions;
  }
}
