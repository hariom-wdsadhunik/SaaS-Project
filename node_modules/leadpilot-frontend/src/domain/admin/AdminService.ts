import {
  FeatureFlagRecord,
  SystemMetricRecord,
  BackgroundJobRecord,
  SecurityEventRecord,
  BackupRecord,
  AdminOverviewStats,
} from "./AdminTypes";

export class AdminService {
  private static mockFlags: FeatureFlagRecord[] = [
    {
      id: "flag-1",
      key: "ai_copilot_v3",
      name: "AI Copilot v3.7 Engine",
      description: "Enable predictive lead scoring and Next Best Action algorithms.",
      enabled: true,
      environment: "PRODUCTION",
      rolloutPercentage: 100,
      updatedAt: new Date().toISOString(),
    },
    {
      id: "flag-2",
      key: "stripe_metered_billing",
      name: "Stripe Metered Usage Billing",
      description: "Enable dynamic per-seat usage billing adapter.",
      enabled: true,
      environment: "PRODUCTION",
      rolloutPercentage: 50,
      targetOrganizations: ["org-enterprise-1"],
      updatedAt: new Date().toISOString(),
    },
  ];

  private static mockMetrics: SystemMetricRecord[] = [
    { metric: "CPU Utilization", value: 24, unit: "%", status: "HEALTHY" },
    { metric: "Memory Allocation", value: 42, unit: "%", status: "HEALTHY" },
    { metric: "API Response Latency", value: 38, unit: "ms", status: "HEALTHY" },
    { metric: "Database Connection Pool", value: 15, unit: "active", status: "HEALTHY" },
    { metric: "Job Queue Health", value: 99.8, unit: "%", status: "HEALTHY" },
    { metric: "AI Inference Engine", value: 99.9, unit: "%", status: "HEALTHY" },
  ];

  private static mockJobs: BackgroundJobRecord[] = [
    {
      id: "job-101",
      name: "Nightly BI Analytics Aggregation",
      queue: "REPORTS",
      status: "COMPLETED",
      attempts: 1,
      maxAttempts: 3,
      scheduledAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 3.8).toISOString(),
    },
    {
      id: "job-102",
      name: "Failed Webhook Retry Queue (Stripe)",
      queue: "WEBHOOKS",
      status: "RUNNING",
      attempts: 2,
      maxAttempts: 5,
      scheduledAt: new Date().toISOString(),
    },
  ];

  private static mockSecurityEvents: SecurityEventRecord[] = [
    {
      id: "sec-1",
      type: "FAILED_LOGIN",
      severity: "WARNING",
      sourceIp: "192.168.1.104",
      userEmail: "unknown@external.org",
      details: "Invalid password attempt threshold exceeded (3 attempts)",
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      id: "sec-2",
      type: "ROLE_ELEVATION",
      severity: "INFO",
      sourceIp: "10.0.4.12",
      userEmail: "admin@leadpilot.ai",
      details: "Granted Organization Owner permissions to user usr-402",
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
  ];

  private static mockBackups: BackupRecord[] = [
    {
      id: "bak-20260730",
      filename: "leadpilot_db_backup_v3.8.0.sql.gz",
      sizeBytes: 428000000,
      status: "COMPLETED",
      retentionDays: 30,
      checksumSha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      createdAt: new Date().toISOString(),
    },
  ];

  public static getOverviewStats(): AdminOverviewStats {
    return {
      activeOrganizations: 142,
      totalUsers: 1280,
      activeFeatureFlagCount: this.mockFlags.filter((f) => f.enabled).length,
      systemUptimePercentage: 99.98,
      failedJobCount: this.mockJobs.filter((j) => j.status === "FAILED").length,
      securityAlertCount: this.mockSecurityEvents.filter((s) => s.severity === "HIGH" || s.severity === "CRITICAL").length,
    };
  }

  public static getFeatureFlags(): FeatureFlagRecord[] {
    return this.mockFlags;
  }

  public static getSystemMetrics(): SystemMetricRecord[] {
    return this.mockMetrics;
  }

  public static getBackgroundJobs(): BackgroundJobRecord[] {
    return this.mockJobs;
  }

  public static getSecurityEvents(): SecurityEventRecord[] {
    return this.mockSecurityEvents;
  }

  public static getBackups(): BackupRecord[] {
    return this.mockBackups;
  }
}
