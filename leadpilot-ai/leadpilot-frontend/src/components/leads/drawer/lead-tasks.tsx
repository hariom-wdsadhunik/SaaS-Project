import * as React from "react";
import { CheckSquare, Clock, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface LeadTaskItem {
  id: string;
  title: string;
  dueDate: string;
  assigneeName: string;
  priority: "URGENT" | "HIGH" | "NORMAL";
  completed: boolean;
}

const mockLeadTasks: LeadTaskItem[] = [
  {
    id: "tsk-1",
    title: "Send WhatsApp floor plan brochure for Downtown Villa #04",
    dueDate: "Today 02:00 PM",
    assigneeName: "Alex Morgan",
    priority: "URGENT",
    completed: false,
  },
  {
    id: "tsk-2",
    title: "Confirm mortgage pre-approval status with client bank",
    dueDate: "Tomorrow 10:00 AM",
    assigneeName: "Sarah Jenkins",
    priority: "HIGH",
    completed: false,
  },
];

export function LeadTasks() {
  const [tasks, setTasks] = React.useState<LeadTaskItem[]>(mockLeadTasks);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 p-8 text-center">
        <CheckSquare className="h-8 w-8 text-zinc-500 mb-2" />
        <p className="text-xs font-semibold text-zinc-300">No Open Tasks</p>
        <p className="text-[11px] text-zinc-500">All tasks associated with this lead are complete.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <Card
          key={task.id}
          onClick={() => toggleTask(task.id)}
          className={`p-3 border-zinc-800 cursor-pointer transition-colors flex items-start justify-between gap-3 ${
            task.completed ? "bg-zinc-950/40 opacity-60" : "bg-zinc-900/80 hover:border-zinc-700"
          }`}
        >
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => {}}
              className="h-4 w-4 mt-0.5 rounded border-zinc-700 bg-zinc-950 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <div className="space-y-1">
              <span
                className={`text-xs font-medium ${
                  task.completed ? "line-through text-zinc-500" : "text-zinc-200"
                }`}
              >
                {task.title}
              </span>
              <div className="flex items-center gap-3 text-[10px] text-zinc-500">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {task.dueDate}
                </span>
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {task.assigneeName}
                </span>
              </div>
            </div>
          </div>

          <Badge
            variant={
              task.priority === "URGENT"
                ? "danger"
                : task.priority === "HIGH"
                ? "warning"
                : "secondary"
            }
            className="text-[10px] px-2 py-0.5 shrink-0"
          >
            {task.priority}
          </Badge>
        </Card>
      ))}
    </div>
  );
}
