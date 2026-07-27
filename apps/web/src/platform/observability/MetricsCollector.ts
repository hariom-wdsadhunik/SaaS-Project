export interface LatencyMetric {
  endpoint: string;
  durationMs: number;
  statusCode: number;
  timestamp: string;
}

export class MetricsCollector {
  private static latencyLogs: LatencyMetric[] = [];

  public static recordAPILatency(endpoint: string, durationMs: number, statusCode: number = 200): void {
    this.latencyLogs.push({
      endpoint,
      durationMs,
      statusCode,
      timestamp: new Date().toISOString(),
    });
  }

  public static getAverageLatency(endpoint?: string): number {
    const logs = endpoint ? this.latencyLogs.filter((l) => l.endpoint === endpoint) : this.latencyLogs;
    if (logs.length === 0) return 42; // default 42ms
    const sum = logs.reduce((acc, l) => acc + l.durationMs, 0);
    return Math.round(sum / logs.length);
  }
}
