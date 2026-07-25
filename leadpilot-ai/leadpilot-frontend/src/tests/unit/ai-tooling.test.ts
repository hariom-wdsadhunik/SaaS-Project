import { toolRegistry } from "@/domain/ai/tools/ToolRegistry";
import { ToolExecutor } from "@/domain/ai/tools/ToolExecutor";
import { ToolRouter } from "@/domain/ai/tools/ToolRouter";

describe("AI Tool Calling Framework Unit Tests", () => {
  test("ToolRegistry resolves all registered AI tools", () => {
    const tools = toolRegistry.getAllTools();
    expect(tools.length).toBe(7);

    const leadTool = toolRegistry.getTool("lead_qualification_tool");
    expect(leadTool.category()).toBe("Leads");
  });

  test("ToolExecutor validates and executes lead qualification tool", async () => {
    const res = await ToolExecutor.executeTool("lead_qualification_tool", { leadId: "lead-88" });
    expect(res.success).toBe(true);
    expect(res.data.qualification).toBe("QUALIFIED_VIP");
  });

  test("ToolRouter dispatches tool call securely", async () => {
    const res = await ToolRouter.dispatchToolCall("deal_strategy_tool", { dealId: "deal-101" });
    expect(res.success).toBe(true);
    expect(res.data.winProbability).toBe("85%");
  });
});
