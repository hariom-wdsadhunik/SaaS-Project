import { TaskRepository } from "@/contracts/task/repository";
import {
  TaskActivityEntity,
  TaskCategory,
  TaskCommentEntity,
  TaskEntity,
  TaskFilterState,
  TaskPriority,
  TaskStatus,
} from "@/domain/task/types";
import { TaskFormInput } from "@/lib/validations/task-form";
import { supabase } from "@/lib/supabase/client";
import { platformAuditLogger } from "@/platform/audit";
import { supabaseContactRepository } from "./SupabaseContactRepository";

export class SupabaseTaskRepository implements TaskRepository {
  async getTasks(filters?: Partial<TaskFilterState>): Promise<TaskEntity[]> {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("due_date", { ascending: true, nullsFirst: false });

    if (error) {
      console.error("[SupabaseTaskRepository] getTasks error:", error.message);
      throw new Error(`Database error fetching tasks: ${error.message}`);
    }

    const mapped: TaskEntity[] = (data || []).map((row) => this.mapRowToEntity(row));

    return this.applyFilters(mapped, filters);
  }

  async getTaskById(id: string): Promise<TaskEntity | null> {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error(`[SupabaseTaskRepository] getTaskById(${id}) error:`, error.message);
      throw new Error(`Database error fetching task ${id}: ${error.message}`);
    }

    if (!data) return null;
    return this.mapRowToEntity(data);
  }

  async createTask(input: TaskFormInput): Promise<TaskEntity> {
    const newRecord = {
      title: input.title,
      description: input.description || "",
      status: input.status || "TODO",
      priority: input.priority || "MEDIUM",
      category: input.category || "FOLLOW_UP",
      due_date: input.dueDate ? new Date(input.dueDate).toISOString() : new Date().toISOString(),
      assigned_to: input.assignedAgentName || "Alex Morgan",
      created_by: "System Admin",
      contact_id: input.contactId || null,
      lead_id: input.leadId || null,
      deal_id: input.dealId || null,
      tags: JSON.stringify([input.category, input.priority]),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("tasks")
      .insert([newRecord])
      .select()
      .single();

    if (error) {
      console.error("[SupabaseTaskRepository] createTask error:", error.message);
      throw new Error(`Database error creating task: ${error.message}`);
    }

    const created = this.mapRowToEntity(data);

    // Append activity event
    await this.appendActivityEvent({
      taskId: created.id,
      eventType: "Task Created",
      title: "Task Created",
      description: `Task "${created.title}" created with priority ${created.priority}.`,
    });

    // If associated with contact, append to contact_timeline
    if (created.contactId) {
      try {
        await supabaseContactRepository.appendTimelineEvent({
          contactId: created.contactId,
          eventType: "Task",
          title: `Task Created: ${created.title}`,
          description: `Assigned to ${created.assignedAgentName}. Due: ${new Date(created.dueDate).toLocaleDateString()}`,
        });
      } catch (timelineErr) {
        console.warn("[SupabaseTaskRepository] Timeline append warning:", timelineErr);
      }
    }

    platformAuditLogger.log({
      action: "CREATE",
      entityType: "TASK",
      entityIds: [created.id],
      payload: { event: "Task Created", title: created.title, priority: created.priority },
      timestamp: new Date().toISOString(),
    });

    return created;
  }

  async updateTask(id: string, input: TaskFormInput): Promise<TaskEntity> {
    const { data, error } = await supabase
      .from("tasks")
      .update({
        title: input.title,
        description: input.description || "",
        status: input.status,
        priority: input.priority,
        category: input.category,
        due_date: input.dueDate ? new Date(input.dueDate).toISOString() : new Date().toISOString(),
        assigned_to: input.assignedAgentName,
        contact_id: input.contactId || null,
        lead_id: input.leadId || null,
        deal_id: input.dealId || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`[SupabaseTaskRepository] updateTask(${id}) error:`, error.message);
      throw new Error(`Database error updating task ${id}: ${error.message}`);
    }

    const updated = this.mapRowToEntity(data);

    await this.appendActivityEvent({
      taskId: updated.id,
      eventType: "Task Updated",
      title: "Task Details Updated",
      description: `Task parameters updated. Status: ${updated.status}, Priority: ${updated.priority}.`,
    });

    platformAuditLogger.log({
      action: "UPDATE",
      entityType: "TASK",
      entityIds: [id],
      payload: { event: "Task Updated", title: updated.title },
      timestamp: new Date().toISOString(),
    });

    return updated;
  }

  async deleteTask(id: string): Promise<boolean> {
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      console.error(`[SupabaseTaskRepository] deleteTask(${id}) error:`, error.message);
      throw new Error(`Database error deleting task ${id}: ${error.message}`);
    }

    platformAuditLogger.log({
      action: "DELETE",
      entityType: "TASK",
      entityIds: [id],
      payload: { event: "Task Deleted", taskId: id },
      timestamp: new Date().toISOString(),
    });

    return true;
  }

  async deleteTasks(ids: string[]): Promise<boolean> {
    const { error } = await supabase.from("tasks").delete().in("id", ids);

    if (error) {
      console.error("[SupabaseTaskRepository] deleteTasks error:", error.message);
      throw new Error(`Database error deleting tasks: ${error.message}`);
    }

    platformAuditLogger.log({
      action: "DELETE",
      entityType: "TASK",
      entityIds: ids,
      payload: { event: "Tasks Bulk Deleted", count: ids.length },
      timestamp: new Date().toISOString(),
    });

    return true;
  }

  async completeTask(id: string): Promise<TaskEntity> {
    const nowIso = new Date().toISOString();
    const { data, error } = await supabase
      .from("tasks")
      .update({
        status: "COMPLETED",
        completed_at: nowIso,
        updated_at: nowIso,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`[SupabaseTaskRepository] completeTask(${id}) error:`, error.message);
      throw new Error(`Database error completing task ${id}: ${error.message}`);
    }

    const completed = this.mapRowToEntity(data);

    await this.appendActivityEvent({
      taskId: completed.id,
      eventType: "Task Completed",
      title: "Task Marked as Completed",
      description: `Task "${completed.title}" marked as completed at ${new Date(nowIso).toLocaleTimeString()}.`,
    });

    if (completed.contactId) {
      try {
        await supabaseContactRepository.appendTimelineEvent({
          contactId: completed.contactId,
          eventType: "Task",
          title: `Task Completed: ${completed.title}`,
          description: `Completed by ${completed.assignedAgentName}.`,
        });
      } catch (err) {
        console.warn("[SupabaseTaskRepository] Timeline complete warning:", err);
      }
    }

    platformAuditLogger.log({
      action: "CHANGE_STATUS",
      entityType: "TASK",
      entityIds: [id],
      payload: { event: "Task Completed", taskId: id, title: completed.title },
      timestamp: nowIso,
    });

    return completed;
  }

  async archiveTask(id: string): Promise<TaskEntity> {
    const { data, error } = await supabase
      .from("tasks")
      .update({ status: "ARCHIVED", updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`[SupabaseTaskRepository] archiveTask(${id}) error:`, error.message);
      throw new Error(`Database error archiving task ${id}: ${error.message}`);
    }

    const archived = this.mapRowToEntity(data);

    await this.appendActivityEvent({
      taskId: archived.id,
      eventType: "Task Archived",
      title: "Task Archived",
      description: `Task "${archived.title}" moved to archive.`,
    });

    platformAuditLogger.log({
      action: "ARCHIVE",
      entityType: "TASK",
      entityIds: [id],
      payload: { event: "Task Archived", taskId: id },
      timestamp: new Date().toISOString(),
    });

    return archived;
  }

  async assignTask(id: string, agentName: string): Promise<TaskEntity> {
    const { data, error } = await supabase
      .from("tasks")
      .update({ assigned_to: agentName, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`[SupabaseTaskRepository] assignTask(${id}) error:`, error.message);
      throw new Error(`Database error assigning task ${id}: ${error.message}`);
    }

    const assigned = this.mapRowToEntity(data);

    await this.appendActivityEvent({
      taskId: assigned.id,
      eventType: "Task Assigned",
      title: "Task Reassigned",
      description: `Assigned task to ${agentName}.`,
    });

    platformAuditLogger.log({
      action: "ASSIGN",
      entityType: "TASK",
      entityIds: [id],
      payload: { event: "Task Assigned", taskId: id, agentName },
      timestamp: new Date().toISOString(),
    });

    return assigned;
  }

  async searchTasks(query: string): Promise<TaskEntity[]> {
    return this.getTasks({ search: query });
  }

  async filterTasks(filters: Partial<TaskFilterState>): Promise<TaskEntity[]> {
    return this.getTasks(filters);
  }

  async bulkUpdateStatus(ids: string[], status: TaskStatus): Promise<boolean> {
    const { error } = await supabase
      .from("tasks")
      .update({ status, updated_at: new Date().toISOString() })
      .in("id", ids);

    if (error) {
      console.error("[SupabaseTaskRepository] bulkUpdateStatus error:", error.message);
      throw new Error(`Database error updating tasks status: ${error.message}`);
    }

    platformAuditLogger.log({
      action: "CHANGE_STATUS",
      entityType: "TASK",
      entityIds: ids,
      payload: { event: "Bulk Task Status Update", status, count: ids.length },
      timestamp: new Date().toISOString(),
    });

    return true;
  }

  async getTaskComments(taskId: string): Promise<TaskCommentEntity[]> {
    const { data, error } = await supabase
      .from("task_comments")
      .select("*")
      .eq("task_id", taskId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error(`[SupabaseTaskRepository] getTaskComments(${taskId}) error:`, error.message);
      return [];
    }

    return (data || []).map((row) => ({
      id: String(row.id),
      taskId: String(row.task_id),
      authorName: String(row.author_name),
      authorAvatar: row.author_avatar ? String(row.author_avatar) : undefined,
      content: String(row.content),
      createdAt: String(row.created_at),
      updatedAt: String(row.updated_at),
    }));
  }

  async addComment(taskId: string, content: string, authorName: string = "Alex Morgan"): Promise<TaskCommentEntity> {
    const { data, error } = await supabase
      .from("task_comments")
      .insert([
        {
          task_id: taskId,
          author_name: authorName,
          author_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
          content,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error(`[SupabaseTaskRepository] addComment error:`, error.message);
      throw new Error(`Database error adding comment: ${error.message}`);
    }

    const comment: TaskCommentEntity = {
      id: String(data.id),
      taskId: String(data.task_id),
      authorName: String(data.author_name),
      authorAvatar: String(data.author_avatar),
      content: String(data.content),
      createdAt: String(data.created_at),
      updatedAt: String(data.updated_at),
    };

    await this.appendActivityEvent({
      taskId,
      eventType: "Comment Added",
      title: "New Note / Comment Added",
      description: `${authorName}: "${content.substring(0, 50)}${content.length > 50 ? "..." : ""}"`,
    });

    platformAuditLogger.log({
      action: "UPDATE",
      entityType: "TASK",
      entityIds: [taskId],
      payload: { event: "Comment Added", taskId, authorName },
      timestamp: new Date().toISOString(),
    });

    return comment;
  }

  async deleteComment(commentId: string): Promise<boolean> {
    const { error } = await supabase.from("task_comments").delete().eq("id", commentId);

    if (error) {
      console.error(`[SupabaseTaskRepository] deleteComment(${commentId}) error:`, error.message);
      throw new Error(`Database error deleting comment: ${error.message}`);
    }

    return true;
  }

  async getTaskActivity(taskId: string): Promise<TaskActivityEntity[]> {
    const { data, error } = await supabase
      .from("task_activity")
      .select("*")
      .eq("task_id", taskId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(`[SupabaseTaskRepository] getTaskActivity(${taskId}) error:`, error.message);
      return [];
    }

    return (data || []).map((row) => ({
      id: String(row.id),
      taskId: String(row.task_id),
      eventType: String(row.event_type),
      title: String(row.title),
      description: row.description ? String(row.description) : undefined,
      metadata: (row.metadata as Record<string, unknown>) || {},
      createdAt: String(row.created_at),
    }));
  }

  private async appendActivityEvent(event: {
    taskId: string;
    eventType: string;
    title: string;
    description?: string;
  }): Promise<void> {
    try {
      await supabase.from("task_activity").insert([
        {
          task_id: event.taskId,
          event_type: event.eventType,
          title: event.title,
          description: event.description || "",
          created_at: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      console.warn("[SupabaseTaskRepository] Activity append exception:", err);
    }
  }

  private mapRowToEntity(row: Record<string, unknown>): TaskEntity {
    let parsedTags: string[] = [];
    if (Array.isArray(row.tags)) {
      parsedTags = row.tags as string[];
    } else if (typeof row.tags === "string") {
      try {
        parsedTags = JSON.parse(row.tags);
      } catch {
        parsedTags = [row.tags];
      }
    }

    return {
      id: String(row.id),
      title: String(row.title || ""),
      description: row.description ? String(row.description) : undefined,
      status: (row.status as TaskStatus) || "TODO",
      priority: (row.priority as TaskPriority) || "MEDIUM",
      category: (row.category as TaskCategory) || "FOLLOW_UP",
      dueDate: String(row.due_date || new Date().toISOString()),
      startDate: row.start_date ? String(row.start_date) : undefined,
      completedAt: row.completed_at ? String(row.completed_at) : undefined,
      assignedAgentName: String(row.assigned_to || "Alex Morgan"),
      createdBy: String(row.created_by || "System Admin"),
      agentAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      contactId: row.contact_id ? String(row.contact_id) : undefined,
      leadId: row.lead_id ? String(row.lead_id) : undefined,
      dealId: row.deal_id ? String(row.deal_id) : undefined,
      reminderAt: row.reminder_at ? String(row.reminder_at) : undefined,
      tags: parsedTags,
      relatedEntityType: row.contact_id
        ? "CONTACT"
        : row.lead_id
        ? "LEAD"
        : row.deal_id
        ? "DEAL"
        : undefined,
      relatedEntityId: (row.contact_id || row.lead_id || row.deal_id || "") as string,
      relatedEntityName: row.contact_id
        ? "Linked Contact Profile"
        : row.lead_id
        ? "Linked Lead Profile"
        : row.deal_id
        ? "Linked Deal Transaction"
        : undefined,
      createdAt: String(row.created_at || new Date().toISOString()),
      updatedAt: String(row.updated_at || new Date().toISOString()),
    };
  }

  private applyFilters(tasks: TaskEntity[], filters?: Partial<TaskFilterState>): TaskEntity[] {
    if (!filters) return tasks;
    return tasks.filter((task) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(q);
        const matchesDesc = (task.description || "").toLowerCase().includes(q);
        const matchesAssignee = task.assignedAgentName.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesAssignee) return false;
      }
      if (filters.status && task.status !== filters.status) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      if (filters.assignedAgent && task.assignedAgentName !== filters.assignedAgent) return false;
      if (filters.category && task.category !== filters.category) return false;
      if (filters.contactId && task.contactId !== filters.contactId) return false;
      if (filters.leadId && task.leadId !== filters.leadId) return false;
      if (filters.dealId && task.dealId !== filters.dealId) return false;
      return true;
    });
  }
}

export const supabaseTaskRepository = new SupabaseTaskRepository();
