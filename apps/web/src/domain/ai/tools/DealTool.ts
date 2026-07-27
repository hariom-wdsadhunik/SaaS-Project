import { AITool } from "./Tool";
import { ToolResult } from "./ToolResult";
import { ToolPermissionLevel } from "./ToolPermission";
import { supabaseDealRepository } from "@/infrastructure/repositories/SupabaseDealRepository";

export class DealTool implements AITool {
  name(): string {
    return "deal_strategy_tool";
  }

  description(): string {
    return "Generates automated deal negotiation strategies and probability scores from live CRM deals.";
  }

  category(): string {
    return "Deals";
  }

  requiredPermission(): ToolPermissionLevel {
    return "READ";
  }

  validate(params: Record<string, unknown>): boolean {
    return typeof params.dealId === "string";
  }

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    const dealId = params.dealId as string;
    const deal = await supabaseDealRepository.getDealById(dealId);

    if (!deal) {
      return {
        toolName: this.name(),
        success: false,
        data: { error: `Deal record with ID ${dealId} not found in database.` },
        timestamp: new Date().toISOString(),
      };
    }

    return {
      toolName: this.name(),
      success: true,
      data: {
        dealId: deal.id,
        title: deal.title,
        value: deal.value,
        stage: deal.stage,
        winProbability: `${deal.probability}%`,
        nextAction: deal.stage === "WON" ? "Contract Finalized" : "Schedule High-Value Property Showing",
        assignedAgent: deal.assignedAgentName,
      },
      timestamp: new Date().toISOString(),
    };
  }
}
