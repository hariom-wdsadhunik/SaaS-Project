import { AITool } from "./Tool";
import { ToolResult } from "./ToolResult";
import { ToolPermissionLevel } from "./ToolPermission";
import { supabaseTaskRepository } from "@/infrastructure/repositories/SupabaseTaskRepository";

export class TaskTool implements AITool {
  name(): string {
    return "task_intelligence_tool";
  }

  description(): string {
    return "Analyzes operational CRM tasks including overdue status, assigned brokers, priority levels, linked contacts, leads, deals, and recent activity history.";
  }

  category(): string {
    return "Tasks";
  }

  requiredPermission(): ToolPermissionLevel {
    return "READ";
  }

  validate(params: Record<string, unknown>): boolean {
    return typeof params.taskId === "string" || params.filter === "overdue" || params.filter === "today" || !params.taskId;
  }

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    const taskId = params.taskId as string | undefined;

    if (taskId) {
      const task = await supabaseTaskRepository.getTaskById(taskId);
      if (!task) {
        return {
          toolName: this.name(),
          success: false,
          data: { error: `Task record with ID ${taskId} not found in database.` },
          timestamp: new Date().toISOString(),
        };
      }

      const comments = await supabaseTaskRepository.getTaskComments(taskId);
      const activity = await supabaseTaskRepository.getTaskActivity(taskId);

      return {
        toolName: this.name(),
        success: true,
        data: {
          taskId: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          category: task.category,
          dueDate: task.dueDate,
          assignedAgent: task.assignedAgentName,
          linkedContact: task.contactId || "None",
          linkedLead: task.leadId || "None",
          linkedDeal: task.dealId || "None",
          commentCount: comments.length,
          recentComments: comments.slice(0, 3),
          activityCount: activity.length,
          recentActivity: activity.slice(0, 5),
        },
        timestamp: new Date().toISOString(),
      };
    }

    const allTasks = await supabaseTaskRepository.getTasks();
    const now = new Date();
    const overdue = allTasks.filter(
      (t) => t.status !== "COMPLETED" && t.status !== "ARCHIVED" && new Date(t.dueDate) < now
    );
    const today = allTasks.filter((t) => {
      const d = new Date(t.dueDate);
      return d.toDateString() === now.toDateString();
    });

    return {
      toolName: this.name(),
      success: true,
      data: {
        totalTasks: allTasks.length,
        overdueCount: overdue.length,
        todayCount: today.length,
        overdueTasksSummary: overdue.map((t) => ({ id: t.id, title: t.title, priority: t.priority, due: t.dueDate })),
        todayTasksSummary: today.map((t) => ({ id: t.id, title: t.title, priority: t.priority, status: t.status })),
      },
      timestamp: new Date().toISOString(),
    };
  }
}
