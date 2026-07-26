import { KPIEngine } from "@/platform/analytics/KPIEngine";

describe("KPIEngine Unit Tests", () => {
  test("calculates and returns all 11 core KPIs", async () => {
    const kpis = await KPIEngine.getKPIs();
    expect(kpis.length).toBe(11);
    const winRateKPI = kpis.find((k) => k.metricKey === "WIN_RATE");
    expect(winRateKPI).toBeDefined();
    expect(winRateKPI?.status).toBeDefined();
  });

  test("getMetric uses caching on subsequent calls", async () => {
    const m1 = await KPIEngine.getMetric("PIPELINE_VALUE");
    const m2 = await KPIEngine.getMetric("PIPELINE_VALUE");
    expect(m1.calculatedAt).toBe(m2.calculatedAt);
  });
});
