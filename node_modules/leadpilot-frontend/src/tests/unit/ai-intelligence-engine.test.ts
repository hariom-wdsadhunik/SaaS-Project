import { AiIntelligenceEngine } from "@/domain/ai/AiIntelligenceEngine";

describe("Enterprise AI Intelligence Engine Unit Tests", () => {
  test("AiIntelligenceEngine computes predictive lead scores with explainability", () => {
    const scores = AiIntelligenceEngine.getLeadScores();
    expect(scores.length).toBeGreaterThan(0);
    const topScore = scores[0];
    expect(topScore.score).toBeGreaterThanOrEqual(90);
    expect(topScore.grade).toBe("A");
    expect(topScore.contributingFactors.length).toBeGreaterThan(0);
  });

  test("AiIntelligenceEngine computes revenue forecasts with confidence bounds", () => {
    const forecasts = AiIntelligenceEngine.getRevenueForecasts();
    expect(forecasts.length).toBeGreaterThan(0);
    const fc = forecasts[0];
    expect(fc.expectedRevenue).toBeGreaterThan(fc.worstCaseRevenue);
    expect(fc.bestCaseRevenue).toBeGreaterThan(fc.expectedRevenue);
    expect(fc.confidencePercentage).toBeGreaterThanOrEqual(90);
  });

  test("AiIntelligenceEngine generates Next Best Action recommendations", () => {
    const actions = AiIntelligenceEngine.getNextBestActions();
    expect(actions.length).toBeGreaterThan(0);
    expect(actions[0].priority).toBe("CRITICAL");
    expect(actions[0].expectedImpact).toContain("Closed-Won Revenue");
  });

  test("AiIntelligenceEngine evaluates deal win probability and churn risk", () => {
    const predictions = AiIntelligenceEngine.getDealPredictions();
    expect(predictions.length).toBeGreaterThan(0);
    expect(predictions[0].winProbabilityPercentage).toBe(88);
    expect(predictions[0].healthStatus).toBe("HEALTHY");
  });
});
