import * as React from "react";
import { Calendar, CheckCircle2, Link as LinkIcon, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TaskEntity } from "@/domain/task/types";
import { formatDate } from "@/utils/formatters";
import { EntityStatusBadge } from "@/platform/ui/entity-status-badge";
import { toast } from "sonner";

interface TaskCardProps {
  task: TaskEntity;
  onSelectTask?: (task: TaskEntity) => void;
}

export const TaskCard = React.memo(function TaskCard({
  task,
  onSelectTask,
}: TaskCardProps) {
  const priorityVariantMap = {
    URGENT: "danger",
    HIGH: "warning",
    MEDIUM: "secondary",
    LOW: "default",
  } as const;

  return (
    <Card
      onClick={() => onSelectTask?.(task)}
      className="group rounded-2xl border-zinc-800/80 bg-zinc-900/90 hover:border-zinc-700/90 hover:bg-zinc-900 shadow-md p-4 space-y-3 cursor-pointer flex flex-col justify-between transition-all select-none"
    >
      {/* Header: Category, Priority, Status */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">
          {task.category}
        </span>

        <div className="flex items-center gap-1.5">
          <Badge variant={priorityVariantMap[task.priority]} className="text-[9px] px-1.5 py-0.2">
            {task.priority}
          </Badge>
          <EntityStatusBadge status={task.status} />
        </div>
      </div>

      {/* Task Title & Description */}
      <div>
        <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
          {task.title}
        </h3>
        {task.description && (
          <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}
      </div>

      {/* Linked Entity Bar */}
      {task.relatedEntityName && (
        <div className="flex items-center gap-1.5 rounded-lg border border-zinc-800/80 bg-zinc-950 p-2 text-xs text-zinc-300">
          <LinkIcon className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
          <span className="text-[10px] font-mono text-zinc-500 uppercase font-semibold">
            {task.relatedEntityType}:
          </span>
          <span className="font-medium text-zinc-200 truncate">{task.relatedEntityName}</span>
        </div>
      )}

      {/* Footer: Due Date, Agent & Complete Action */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-xs">
        <div className="flex items-center gap-3 text-zinc-400 font-mono text-[11px]">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-zinc-500" />
            <span>{formatDate(task.dueDate)}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="h-3 w-3 text-zinc-500" />
            <Avatar src={task.agentAvatarUrl} fallback={task.assignedAgentName[0]} size="sm" />
          </div>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            toast.success(`Task "${task.title}" marked as COMPLETED`);
          }}
          className="h-7 text-xs px-2 gap-1"
        >
          <CheckCircle2 className="h-3 w-3 text-emerald-400" />
          <span>Done</span>
        </Button>
      </div>
    </Card>
  );
});
