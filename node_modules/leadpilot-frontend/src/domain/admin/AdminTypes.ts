export interface FeatureFlagRecord {
  id: string;
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  environment: "PRODUCTION" | "STAGING" | "DEVELOPMENT";
  rolloutPercentage: number; // 0 - 100
  targetOrganizations?: string[];
  updatedAt: string;
}

export interface SystemMetricRecord {
  metric: string;
  value: number;
  unit: string;
  status: "HEALTHY" | "WARNING" | "CRITICAL";
  details?: string;
}

export interface BackgroundJobRecord {
  id: string;
  name: string;
  queue: "DEFAULT" | "WEBHOOKS" | "REPORTS" | "EMAILS";
  status: "RUNNING" | "COMPLETED" | "FAILED" | "SCHEDULED";
  attempts: number;
  maxAttempts: number;
  lastError?: string;
  scheduledAt: string;
  completedAt?: string;
}

export interface SecurityEventRecord {
  id: string;
  type: "FAILED_LOGIN" | "API_USAGE_SPIKE" | "WEBHOOK_FAILURE" | "ROLE_ELEVATION" | "UNAUTHORIZED_ACCESS";
  severity: "INFO" | "WARNING" | "HIGH" | "CRITICAL";
  sourceIp: string;
  userEmail?: string;
  details: string;
  timestamp: string;
}

export interface BackupRecord {
  id: string;
  filename: string;
  sizeBytes: number;
  status: "COMPLETED" | "IN_PROGRESS" | "FAILED";
  retentionDays: number;
  checksumSha256: string;
  createdAt: string;
}

export interface AdminOverviewStats {
  activeOrganizations: number;
  totalUsers: number;
  activeFeatureFlagCount: number;
  systemUptimePercentage: number;
  failedJobCount: number;
  securityAlertCount: number;
}
