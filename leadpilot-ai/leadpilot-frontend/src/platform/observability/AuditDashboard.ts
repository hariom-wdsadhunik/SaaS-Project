import { HealthCheckService } from "./HealthCheckService";
import { MetricsCollector } from "./MetricsCollector";
import { MonitoringService } from "./MonitoringService";

export class AuditDashboard {
  public static async getSystemObservabilityOverview(): Promise<Record<string, unknown>> {
    const health = await HealthCheckService.checkHealth();
    const avgLatencyMs = MetricsCollector.getAverageLatency();
    const alerts = MonitoringService.getActiveAlerts();

    return {
      version: "v1.0.0",
      status: health.status,
      checks: health.checks,
      uptimeSeconds: health.uptimeSeconds,
      metrics: {
        averageAPILatencyMs: avgLatencyMs,
        activeAlertsCount: alerts.length,
      },
      alerts,
      timestamp: new Date().toISOString(),
    };
  }
}
