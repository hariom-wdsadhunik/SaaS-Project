import { AnalyticsMetric, KPI } from "@/domain/analytics/types";
import { MetricCache } from "./MetricCache";
import { MetricCalculator } from "./MetricCalculator";
import { MetricRegistry } from "./MetricRegistry";
import { eventBus } from "@/platform/events/EventBus";

export class KPIEngine {
  public static async getMetric(key: string, forceRefresh: boolean = false): Promise<AnalyticsMetric> {
    if (!forceRefresh) {
      const cached = MetricCache.get(key);
      if (cached) return cached;
    }

    const metric = await MetricCalculator.calculateMetric(key);
    MetricCache.set(key, metric);

    await eventBus.publish("MetricUpdated", metric.id, { key, value: metric.value });
    return metric;
  }

  public static async getAllMetrics(forceRefresh: boolean = false): Promise<AnalyticsMetric[]> {
    const definitions = MetricRegistry.getAllDefinitions();
    const metrics = await Promise.all(definitions.map((def) => this.getMetric(def.key, forceRefresh)));
    return metrics;
  }

  public static async getKPIs(): Promise<KPI[]> {
    const metrics = await this.getAllMetrics();

    return metrics.map((m) => {
      const target = m.target || m.value * 1.2;
      const pct = (m.value / Math.max(target, 1)) * 100;
      let status: "ON_TRACK" | "AT_RISK" | "BEHIND" | "EXCEEDED" = "ON_TRACK";

      if (pct >= 100) status = "EXCEEDED";
      else if (pct >= 85) status = "ON_TRACK";
      else if (pct >= 65) status = "AT_RISK";
      else status = "BEHIND";

      const change = m.changePercentage || 0;
      const trend = change > 0 ? "UP" : change < 0 ? "DOWN" : "FLAT";

      return {
        id: `kpi-${m.id}`,
        metricKey: m.id.replace("mtr-", ""),
        title: m.name,
        currentValue: m.value,
        targetValue: target,
        status,
        unit: m.unit,
        period: m.period,
        trend,
        updatedAt: m.calculatedAt,
      };
    });
  }

  public static invalidateAllCache(): void {
    MetricCache.clear();
  }
}
