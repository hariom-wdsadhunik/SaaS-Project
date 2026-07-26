import { InsightEngine } from "@/platform/analytics/insights/InsightEngine";

describe("InsightEngine Unit Tests", () => {
  test("generates ranked AI insights from CRM datasets", async () => {
    const insights = await InsightEngine.generateInsights();
    expect(insights.length).toBeGreaterThan(0);
    expect(insights[0].score).toBeGreaterThan(0);
    expect(insights[0].recommendedAction).toBeDefined();
  });
});
