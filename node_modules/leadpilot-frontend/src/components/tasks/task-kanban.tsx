"use client";

import * as React from "react";
import { TaskEntity, TaskStatus } from "@/domain/task/types";
import { TaskCard } from "./task-card";
import { Badge } from "@/components/ui/badge";

interface TaskKanbanProps {
  tasks: TaskEntity[];
  onSelectTask: (task: TaskEntity) => void;
  onStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
}

const COLUMNS: { status: TaskStatus; label: string; color: string }[] = [
  { status: "TODO", label: "To Do", color: "bg-blue-500/10 text-blue-400 border-blue-500/30" },
  { status: "IN_PROGRESS", label: "In Progress", color: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
  { status: "WAITING", label: "Waiting / Pending", color: "bg-purple-500/10 text-purple-400 border-purple-500/30" },
  { status: "COMPLETED", label: "Completed", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
];

export function TaskKanban({ tasks, onSelectTask }: TaskKanbanProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 overflow-x-auto pb-4 no-scrollbar">
      {COLUMNS.map((column) => {
        const columnTasks = tasks.filter((t) => t.status === column.status);
        return (
          <div
            key={column.status}
            className="flex flex-col rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4 space-y-4 min-h-[500px]"
          >
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">{column.label}</span>
                <Badge variant="outline" className={`text-[10px] ${column.color}`}>
                  {columnTasks.length}
                </Badge>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto pr-1">
              {columnTasks.length === 0 ? (
                <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-zinc-800 text-xs text-zinc-500">
                  No tasks in {column.label}
                </div>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onSelectTask={onSelectTask} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
