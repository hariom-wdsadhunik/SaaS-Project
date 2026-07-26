import { MetricRegistry } from "@/platform/analytics/MetricRegistry";
import { MetricCache } from "@/platform/analytics/MetricCache";

describe("Analytics Foundation Unit Tests", () => {
  test("MetricRegistry includes 11 core KPI definitions", () => {
    const defs = MetricRegistry.getAllDefinitions();
    expect(defs.length).toBe(11);
    expect(MetricRegistry.getDefinition("LEAD_CONVERSION_RATE")).toBeDefined();
    expect(MetricRegistry.getDefinition("WIN_RATE")).toBeDefined();
  });

  test("MetricCache stores and retrieves metrics within TTL window", () => {
    const mockMetric = {
      id: "mtr-test",
      name: "Test Metric",
      category: "REVENUE" as const,
      value: 100,
      unit: "COUNT" as const,
      period: "MONTHLY" as const,
      calculatedAt: new Date().toISOString(),
    };

    MetricCache.set("mtr-test", mockMetric, 60000);
    const cached = MetricCache.get("mtr-test");
    expect(cached).not.toBeNull();
    expect(cached?.value).toBe(100);
  });
});
