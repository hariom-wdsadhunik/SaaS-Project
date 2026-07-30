export interface ExplainabilityFactor {
  feature: string;
  weight: number; // e.g. +25 or -10
  description: string;
}

export interface LeadScoreResult {
  leadId: string;
  leadName: string;
  company: string;
  score: number; // 0 - 100
  grade: "A" | "B" | "C" | "D";
  confidence: number; // e.g. 92%
  summary: string;
  contributingFactors: ExplainabilityFactor[];
  suggestedAction: string;
  calculatedAt: string;
}

export interface RevenueForecastResult {
  period: "MONTHLY" | "QUARTERLY" | "ANNUAL";
  targetPeriodName: string; // e.g. "Q3 2026"
  expectedRevenue: number;
  bestCaseRevenue: number;
  worstCaseRevenue: number;
  confidenceLowerBound: number;
  confidenceUpperBound: number;
  confidencePercentage: number;
  pipelineCoverageRatio: number;
}

export interface NextBestActionItem {
  id: string;
  entityType: "LEAD" | "DEAL" | "CONTACT";
  entityId: string;
  entityName: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  recommendedAction: string;
  expectedImpact: string;
  reasoning: string;
  urgency: "IMMEDIATE" | "TODAY" | "THIS_WEEK";
}

export interface DealWinPrediction {
  dealId: string;
  dealName: string;
  amount: number;
  winProbabilityPercentage: number;
  churnRiskPercentage: number;
  healthStatus: "HEALTHY" | "AT_RISK" | "CRITICAL";
  keyDrivers: string[];
}
