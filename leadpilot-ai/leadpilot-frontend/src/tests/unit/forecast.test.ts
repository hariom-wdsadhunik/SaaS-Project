import { ForecastEngine } from "@/platform/analytics/forecast/ForecastEngine";

describe("ForecastEngine Unit Tests", () => {
  test("generates 30-day predictive revenue forecast points", async () => {
    const forecast = await ForecastEngine.generateForecast("REVENUE", 30);
    expect(forecast.id).toBeDefined();
    expect(forecast.points.length).toBe(30);
    expect(forecast.totalPredictedValue).toBeGreaterThan(0);
    expect(forecast.points[0].confidenceScore).toBe(0.92);
  });
});
