import { AITool } from "./Tool";
import { ToolResult } from "./ToolResult";
import { ToolPermissionLevel } from "./ToolPermission";

export class AppointmentTool implements AITool {
  name(): string {
    return "appointment_booking_tool";
  }

  description(): string {
    return "Schedules VIP property viewings and client consultations.";
  }

  category(): string {
    return "Appointments";
  }

  requiredPermission(): ToolPermissionLevel {
    return "WRITE";
  }

  validate(params: Record<string, unknown>): boolean {
    return typeof params.leadId === "string" && typeof params.startTime === "string";
  }

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    await new Promise((res) => setTimeout(res, 100));
    return {
      toolName: this.name(),
      success: true,
      data: { appointmentId: `apt-gen-${Date.now()}`, status: "CONFIRMED", startTime: params.startTime },
      timestamp: new Date().toISOString(),
    };
  }
}
