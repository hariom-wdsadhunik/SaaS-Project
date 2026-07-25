import { TaskEntity, TaskFilterState } from "@/domain/task/types";
import { TaskFormInput } from "@/lib/validations/task-form";

export interface TaskRepository {
  getTasks(filters?: Partial<TaskFilterState>): Promise<TaskEntity[]>;
  getTaskById(id: string): Promise<TaskEntity | null>;
  createTask(input: TaskFormInput): Promise<TaskEntity>;
  updateTask(id: string, input: TaskFormInput): Promise<TaskEntity>;
  deleteTasks(ids: string[]): Promise<boolean>;
}
