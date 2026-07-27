export interface CustomerMetricsInput {
  loginFrequencyDaysPerWeek: number; // 0 - 7
  featureAdoptionCount: number; // 0 - 10
  monthlyAiQueries: number;
  monthlyWorkflowRuns: number;
  openUnresolvedTickets: number;
  storageUtilizationPercentage: number;
  onboardingCompleted: boolean;
}

export interface CustomerHealthScore {
  score: number; // 0 to 100
  status: "HEALTHY" | "NEUTRAL" | "AT_RISK";
  breakdown: {
    loginScore: number;
    adoptionScore: number;
    aiUsageScore: number;
    workflowScore: number;
    supportDeduction: number;
    onboardingBonus: number;
  };
  recommendation: string;
}

export class HealthScoreEngine {
  calculateScore(metrics: CustomerMetricsInput): CustomerHealthScore {
    // 1. Login Frequency Score (Max 25 pts)
    const loginScore = Math.min(25, Math.round((metrics.loginFrequencyDaysPerWeek / 7) * 25));

    // 2. Feature Adoption Score (Max 25 pts)
    const adoptionScore = Math.min(25, Math.round((metrics.featureAdoptionCount / 8) * 25));

    // 3. AI Usage Score (Max 20 pts)
    const aiUsageScore = Math.min(20, Math.round((metrics.monthlyAiQueries / 200) * 20));

    // 4. Workflow Automation Score (Max 20 pts)
    const workflowScore = Math.min(20, Math.round((metrics.monthlyWorkflowRuns / 500) * 20));

    // 5. Support Ticket Penalty (-5 per open ticket)
    const supportDeduction = metrics.openUnresolvedTickets * 5;

    // 6. Onboarding Bonus (+10 pts)
    const onboardingBonus = metrics.onboardingCompleted ? 10 : 0;

    // Composite Calculation
    const rawScore = loginScore + adoptionScore + aiUsageScore + workflowScore + onboardingBonus - supportDeduction;
    const score = Math.max(0, Math.min(100, rawScore));

    let status: "HEALTHY" | "NEUTRAL" | "AT_RISK" = "HEALTHY";
    let recommendation = "Account shows high engagement and healthy platform adoption.";

    if (score < 50) {
      status = "AT_RISK";
      recommendation = "High churn risk detected. Schedule Customer Success check-in meeting immediately.";
    } else if (score < 75) {
      status = "NEUTRAL";
      recommendation = "Moderate engagement. Offer guided walkthroughs for AI Copilot and Workflows.";
    }

    return {
      score,
      status,
      breakdown: {
        loginScore,
        adoptionScore,
        aiUsageScore,
        workflowScore,
        supportDeduction,
        onboardingBonus,
      },
      recommendation,
    };
  }
}
