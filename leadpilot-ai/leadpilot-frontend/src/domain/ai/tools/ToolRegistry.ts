import { AITool } from "./Tool";
import { LeadTool } from "./LeadTool";
import { DealTool } from "./DealTool";
import { TaskTool } from "./TaskTool";
import { AppointmentTool } from "./AppointmentTool";
import { CalendarTool } from "./CalendarTool";
import { CommunicationTool } from "./CommunicationTool";
import { SearchTool } from "./SearchTool";

export class ToolRegistry {
  private tools: Map<string, AITool> = new Map();

  constructor() {
    this.register(new LeadTool());
    this.register(new DealTool());
    this.register(new TaskTool());
    this.register(new AppointmentTool());
    this.register(new CalendarTool());
    this.register(new CommunicationTool());
    this.register(new SearchTool());
  }

  register(tool: AITool): void {
    this.tools.set(tool.name(), tool);
  }

  getTool(name: string): AITool {
    const tool = this.tools.get(name);
    if (!tool) throw new Error(`Tool not found in registry: ${name}`);
    return tool;
  }

  getAllTools(): AITool[] {
    return Array.from(this.tools.values());
  }
}

export const toolRegistry = new ToolRegistry();
