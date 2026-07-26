import { AnalyticsMetric } from "@/domain/analytics/types";

export class MetricCache {
  private static cache: Map<string, { metric: AnalyticsMetric; expiresAt: number }> = new Map();
  private static DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes

  public static get(key: string): AnalyticsMetric | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.metric;
  }

  public static set(key: string, metric: AnalyticsMetric, ttlMs: number = this.DEFAULT_TTL_MS): void {
    this.cache.set(key, {
      metric,
      expiresAt: Date.now() + ttlMs,
    });
  }

  public static invalidate(key: string): void {
    this.cache.delete(key);
  }

  public static clear(): void {
    this.cache.clear();
  }
}
