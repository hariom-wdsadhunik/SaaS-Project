import { MetricsCollector } from "@/platform/observability/MetricsCollector";

describe("Performance & Metrics Unit Tests", () => {
  test("records API latency and calculates average endpoint duration", () => {
    MetricsCollector.recordAPILatency("/api/v1/analytics", 35);
    MetricsCollector.recordAPILatency("/api/v1/analytics", 45);

    const avg = MetricsCollector.getAverageLatency("/api/v1/analytics");
    expect(avg).toBe(40);
  });
});
