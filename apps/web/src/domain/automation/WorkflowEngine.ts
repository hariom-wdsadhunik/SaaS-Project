import {
  WorkflowRule,
  WorkflowExecutionLog,
  WorkflowCondition,
  WorkflowTriggerType,
  WorkflowTemplate,
} from "./WorkflowTypes";

export class WorkflowEngine {
  private static mockRules: WorkflowRule[] = [
    {
      id: "wf-101",
      name: "New Lead Instant Welcome & Task Creation",
      description: "Triggers on new lead creation, sends welcome WhatsApp and assigns follow-up task to Agent.",
      enabled: true,
      trigger: "LEAD_CREATED",
      conditions: [
        {
          id: "cond-1",
          field: "source",
          operator: "EQUALS",
          value: "Website Inquiry",
          logic: "AND",
        },
      ],
      actions: [
        {
          id: "act-1",
          type: "SEND_WHATSAPP",
          config: { template: "welcome_inquiry_v1" },
        },
        {
          id: "act-2",
          type: "CREATE_TASK",
          config: { title: "Initial Lead Qualification Call", dueInHours: 2 },
        },
      ],
      organizationId: "org-1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "wf-102",
      name: "Deal Won Celebration & Onboarding Sequence",
      description: "Fires when a deal moves to Won stage, notifies team and triggers AI Copilot introduction.",
      enabled: true,
      trigger: "DEAL_WON",
      conditions: [],
      actions: [
        {
          id: "act-3",
          type: "CREATE_NOTIFICATION",
          config: { message: "🎉 Deal Won! Celebration broadcast sent to sales team." },
        },
        {
          id: "act-4",
          type: "CALL_AI_COPILOT",
          config: { prompt: "Generate post-sale onboarding summary for account manager" },
        },
      ],
      organizationId: "org-1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  private static mockLogs: WorkflowExecutionLog[] = [
    {
      id: "log-101",
      workflowId: "wf-101",
      workflowName: "New Lead Instant Welcome & Task Creation",
      trigger: "LEAD_CREATED",
      executionTime: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      result: "SUCCESS",
      durationMs: 142,
      retries: 0,
      details: "Dispatched WhatsApp message and created follow-up task for Metro Commercial Group",
    },
    {
      id: "log-102",
      workflowId: "wf-102",
      workflowName: "Deal Won Celebration & Onboarding Sequence",
      trigger: "DEAL_WON",
      executionTime: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      result: "SUCCESS",
      durationMs: 289,
      retries: 0,
      details: "Notified team and generated AI onboarding summary for Downtown Plaza Acquisition",
    },
  ];

  public static getTemplates(): WorkflowTemplate[] {
    return [
      {
        id: "tpl-1",
        name: "New Lead Follow-up",
        description: "Automate initial email response and follow-up task creation when a new lead is captured.",
        category: "LEAD_NURTURING",
        trigger: "LEAD_CREATED",
        conditions: [],
        actions: [
          { id: "a1", type: "SEND_EMAIL", config: { template: "lead_welcome_v1" } },
          { id: "a2", type: "CREATE_TASK", config: { title: "Follow up with new lead", dueInHours: 4 } },
        ],
      },
      {
        id: "tpl-2",
        name: "Lead Auto-Assignment",
        description: "Assign incoming high-priority leads to available sales agents immediately.",
        category: "SALES_OPERATIONS",
        trigger: "LEAD_CREATED",
        conditions: [
          { id: "c1", field: "budget", operator: "GREATER_THAN", value: 1000000, logic: "AND" },
        ],
        actions: [{ id: "a3", type: "ASSIGN_LEAD", config: { strategy: "ROUND_ROBIN" } }],
      },
      {
        id: "tpl-3",
        name: "Deal Won Celebration",
        description: "Notify management and trigger AI summary when a deal reaches Won stage.",
        category: "DEAL_MANAGEMENT",
        trigger: "DEAL_WON",
        conditions: [],
        actions: [
          { id: "a4", type: "CREATE_NOTIFICATION", config: { message: "Deal Closed!" } },
          { id: "a5", type: "CALL_AI_COPILOT", config: { prompt: "Generate handover document" } },
        ],
      },
      {
        id: "tpl-4",
        name: "Deal Lost Recovery",
        description: "Add Tag 'Nurture' and schedule a 30-day follow-up task when a deal is Lost.",
        category: "DEAL_MANAGEMENT",
        trigger: "DEAL_LOST",
        conditions: [],
        actions: [
          { id: "a6", type: "ADD_TAG", config: { tag: "Re-engage Later" } },
          { id: "a7", type: "CREATE_TASK", config: { title: "Re-engage lost deal", dueInHours: 720 } },
        ],
      },
      {
        id: "tpl-5",
        name: "Appointment Reminder",
        description: "Send WhatsApp & SMS reminders 24 hours prior to scheduled property viewings.",
        category: "CUSTOMER_SUCCESS",
        trigger: "APPOINTMENT_CREATED",
        conditions: [],
        actions: [
          { id: "a8", type: "SEND_WHATSAPP", config: { template: "appointment_reminder" } },
          { id: "a9", type: "SEND_SMS", config: { message: "Reminder: Property Viewing tomorrow." } },
        ],
      },
      {
        id: "tpl-6",
        name: "Payment Reminder",
        description: "Send automated email notification when billing/subscription updates occur.",
        category: "SALES_OPERATIONS",
        trigger: "BILLING_UPDATED",
        conditions: [],
        actions: [{ id: "a10", type: "SEND_EMAIL", config: { template: "billing_notice" } }],
      },
      {
        id: "tpl-7",
        name: "Inactive Lead Re-engagement",
        description: "Trigger AI Copilot to draft a personalized re-engagement message for cold leads.",
        category: "LEAD_NURTURING",
        trigger: "LEAD_UPDATED",
        conditions: [
          { id: "c2", field: "status", operator: "EQUALS", value: "INACTIVE", logic: "AND" },
        ],
        actions: [{ id: "a11", type: "CALL_AI_COPILOT", config: { prompt: "Draft re-engagement email" } }],
      },
    ];
  }

  public static async getWorkflows(orgId: string = "org-1"): Promise<WorkflowRule[]> {
    return this.mockRules.filter((r) => r.organizationId === orgId);
  }

  public static async toggleWorkflow(id: string): Promise<boolean> {
    const rule = this.mockRules.find((r) => r.id === id);
    if (!rule) return false;
    rule.enabled = !rule.enabled;
    rule.updatedAt = new Date().toISOString();
    return rule.enabled;
  }

  public static async getExecutionHistory(): Promise<WorkflowExecutionLog[]> {
    return this.mockLogs;
  }

  public static evaluateCondition(condition: WorkflowCondition, payload: Record<string, string | number | boolean>): boolean {
    const actual = payload[condition.field];
    if (actual === undefined || actual === null) return false;

    switch (condition.operator) {
      case "EQUALS":
        return String(actual).toLowerCase() === String(condition.value).toLowerCase();
      case "NOT_EQUALS":
        return String(actual).toLowerCase() !== String(condition.value).toLowerCase();
      case "CONTAINS":
        return String(actual).toLowerCase().includes(String(condition.value).toLowerCase());
      case "GREATER_THAN":
        return Number(actual) > Number(condition.value);
      case "LESS_THAN":
        return Number(actual) < Number(condition.value);
      default:
        return false;
    }
  }

  public static async executeTrigger(
    trigger: WorkflowTriggerType,
    payload: Record<string, string | number | boolean>,
    orgId: string = "org-1"
  ): Promise<WorkflowExecutionLog[]> {
    const activeRules = this.mockRules.filter(
      (r) => r.organizationId === orgId && r.enabled && r.trigger === trigger
    );

    const logs: WorkflowExecutionLog[] = [];

    for (const rule of activeRules) {
      const start = Date.now();
      let passed = true;

      for (const cond of rule.conditions) {
        if (!this.evaluateCondition(cond, payload)) {
          passed = false;
          break;
        }
      }

      if (passed) {
        const log: WorkflowExecutionLog = {
          id: `log-${Date.now()}`,
          workflowId: rule.id,
          workflowName: rule.name,
          trigger,
          executionTime: new Date().toISOString(),
          result: "SUCCESS",
          durationMs: Date.now() - start + 45,
          retries: 0,
          details: `Successfully executed ${rule.actions.length} action(s) for trigger ${trigger}`,
        };
        logs.push(log);
        this.mockLogs.unshift(log);
      }
    }

    return logs;
  }
}
