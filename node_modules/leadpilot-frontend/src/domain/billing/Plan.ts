export type PlanTier = "starter" | "professional" | "enterprise";

export interface PlanLimits {
  maxUsers: number;
  maxLeads: number;
  maxDeals: number;
  maxStorageMb: number;
  maxAIRequests: number;
  maxWorkflowExecutions: number;
  maxDocuments: number;
  maxMessages: number;
}

export interface Plan {
  id: string;
  name: string;
  tier: PlanTier;
  monthlyPriceUsd: number;
  yearlyPriceUsd: number;
  limits: PlanLimits;
  stripeMonthlyPriceId?: string;
  stripeYearlyPriceId?: string;
}

export const STARTER_PLAN: Plan = {
  id: "plan_starter",
  name: "Starter",
  tier: "starter",
  monthlyPriceUsd: 49,
  yearlyPriceUsd: 470,
  limits: {
    maxUsers: 5,
    maxLeads: 1000,
    maxDeals: 250,
    maxStorageMb: 10240,
    maxAIRequests: 500,
    maxWorkflowExecutions: 1000,
    maxDocuments: 100,
    maxMessages: 500,
  },
};

export const PROFESSIONAL_PLAN: Plan = {
  id: "plan_professional",
  name: "Professional",
  tier: "professional",
  monthlyPriceUsd: 149,
  yearlyPriceUsd: 1430,
  limits: {
    maxUsers: 25,
    maxLeads: 10000,
    maxDeals: 2500,
    maxStorageMb: 102400,
    maxAIRequests: 5000,
    maxWorkflowExecutions: 10000,
    maxDocuments: 1000,
    maxMessages: 5000,
  },
};

export const ENTERPRISE_PLAN: Plan = {
  id: "plan_enterprise",
  name: "Enterprise",
  tier: "enterprise",
  monthlyPriceUsd: 499,
  yearlyPriceUsd: 4790,
  limits: {
    maxUsers: 9999,
    maxLeads: 999999,
    maxDeals: 99999,
    maxStorageMb: 1048576,
    maxAIRequests: 999999,
    maxWorkflowExecutions: 999999,
    maxDocuments: 99999,
    maxMessages: 999999,
  },
};
