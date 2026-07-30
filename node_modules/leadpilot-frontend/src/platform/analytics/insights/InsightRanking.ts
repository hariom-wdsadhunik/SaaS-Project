import { Insight } from "@/domain/analytics/types";

export class InsightRanking {
  public static rankInsights(insights: Insight[]): Insight[] {
    const severityWeights = { CRITICAL: 100, HIGH: 75, MEDIUM: 50, LOW: 25 };

    return [...insights].sort((a, b) => {
      const weightA = severityWeights[a.severity] + a.score;
      const weightB = severityWeights[b.severity] + b.score;
      return weightB - weightA;
    });
  }
}
