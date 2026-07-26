import { TaskActivityEntity, TaskCommentEntity, TaskEntity, TaskFilterState, TaskStatus } from "@/domain/task/types";
import { TaskFormInput } from "@/lib/validations/task-form";

export interface TaskRepository {
  getTasks(filters?: Partial<TaskFilterState>): Promise<TaskEntity[]>;
  getTaskById(id: string): Promise<TaskEntity | null>;
  createTask(input: TaskFormInput): Promise<TaskEntity>;
  updateTask(id: string, input: TaskFormInput): Promise<TaskEntity>;
  deleteTask(id: string): Promise<boolean>;
  deleteTasks(ids: string[]): Promise<boolean>;
  completeTask(id: string): Promise<TaskEntity>;
  archiveTask(id: string): Promise<TaskEntity>;
  assignTask(id: string, agentName: string): Promise<TaskEntity>;
  searchTasks(query: string): Promise<TaskEntity[]>;
  filterTasks(filters: Partial<TaskFilterState>): Promise<TaskEntity[]>;
  bulkUpdateStatus(ids: string[], status: TaskStatus): Promise<boolean>;
  getTaskComments(taskId: string): Promise<TaskCommentEntity[]>;
  addComment(taskId: string, content: string, authorName?: string): Promise<TaskCommentEntity>;
  deleteComment(commentId: string): Promise<boolean>;
  getTaskActivity(taskId: string): Promise<TaskActivityEntity[]>;
}
