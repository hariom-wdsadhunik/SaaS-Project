"use client";

import * as React from "react";
import { CheckCircle2, Clock, AlertTriangle, Calendar, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabaseTaskRepository } from "@/infrastructure/repositories/SupabaseTaskRepository";
import { TaskEntity } from "@/domain/task/types";

export function TaskWidgets() {
  const [tasks, setTasks] = React.useState<TaskEntity[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    supabaseTaskRepository
      .getTasks()
      .then((data) => {
        setTasks(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const now = new Date();

  const overdueTasks = tasks.filter(
    (t) => t.status !== "COMPLETED" && t.status !== "ARCHIVED" && new Date(t.dueDate) < now
  );

  const todayTasks = tasks.filter((t) => {
    const d = new Date(t.dueDate);
    return d.toDateString() === now.toDateString() && t.status !== "ARCHIVED";
  });

  const upcomingTasks = tasks.filter((t) => {
    const d = new Date(t.dueDate);
    return d > now && t.status !== "COMPLETED" && t.status !== "ARCHIVED";
  });

  const completedCount = tasks.filter((t) => t.status === "COMPLETED").length;
  const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 100;

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-2xl border border-zinc-800 bg-zinc-950/60" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
          <Clock className="h-4 w-4 text-indigo-400" />
          <span>Task Operational Execution Widgets</span>
        </h3>
        <Badge variant="outline" className="text-[10px] text-zinc-400">
          Real-time Engine
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Today's Tasks Widget */}
        <Card className="rounded-2xl border-zinc-800/80 bg-zinc-900/90 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Today&apos;s Tasks</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <Calendar className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white font-mono">{todayTasks.length}</span>
            <span className="text-[10px] text-indigo-400 font-mono flex items-center">
              Active Agenda <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
        </Card>

        {/* Overdue Tasks Widget */}
        <Card className="rounded-2xl border-rose-500/20 bg-rose-500/5 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-300">Overdue Tasks</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400">
              <AlertTriangle className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-rose-200 font-mono">{overdueTasks.length}</span>
            <span className="text-[10px] text-rose-400 font-mono">Requires Action</span>
          </div>
        </Card>

        {/* Upcoming Tasks Widget */}
        <Card className="rounded-2xl border-zinc-800/80 bg-zinc-900/90 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Upcoming Tasks</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white font-mono">{upcomingTasks.length}</span>
            <span className="text-[10px] text-zinc-400 font-mono">Next 7 Days</span>
          </div>
        </Card>

        {/* Task Completion Rate Widget */}
        <Card className="rounded-2xl border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-300">Completion Rate</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-200 font-mono">{completionRate}%</span>
            <span className="text-[10px] text-emerald-400 font-mono">{completedCount} Completed</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
