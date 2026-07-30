import { Plan, STARTER_PLAN, PROFESSIONAL_PLAN, ENTERPRISE_PLAN } from "@/domain/billing/Plan";
import { MetricName } from "@/domain/billing/UsageRecord";

export interface UsageCheckResult {
  allowed: boolean;
  currentCount: number;
  maxLimit: number;
  percentageUsed: number;
}

export class UsageLimitEngine {
  private getPlan(planTier: string): Plan {
    switch (planTier) {
      case "starter":
        return STARTER_PLAN;
      case "enterprise":
        return ENTERPRISE_PLAN;
      case "professional":
      default:
        return PROFESSIONAL_PLAN;
    }
  }

  checkLimit(planTier: string, metric: MetricName, currentCount: number): UsageCheckResult {
    const plan = this.getPlan(planTier);
    let maxLimit = 1000;

    switch (metric) {
      case "users":
        maxLimit = plan.limits.maxUsers;
        break;
      case "leads":
        maxLimit = plan.limits.maxLeads;
        break;
      case "deals":
        maxLimit = plan.limits.maxDeals;
        break;
      case "storage_mb":
        maxLimit = plan.limits.maxStorageMb;
        break;
      case "ai_requests":
        maxLimit = plan.limits.maxAIRequests;
        break;
      case "workflow_executions":
        maxLimit = plan.limits.maxWorkflowExecutions;
        break;
      case "documents":
        maxLimit = plan.limits.maxDocuments;
        break;
      case "messages":
        maxLimit = plan.limits.maxMessages;
        break;
    }

    const allowed = currentCount < maxLimit;
    const percentageUsed = Math.min(100, Math.round((currentCount / maxLimit) * 100));

    return {
      allowed,
      currentCount,
      maxLimit,
      percentageUsed,
    };
  }
}
