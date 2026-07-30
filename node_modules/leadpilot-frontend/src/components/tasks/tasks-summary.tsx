import * as React from "react";
import { CheckSquare, Clock, AlertTriangle, CheckCircle, Flame } from "lucide-react";
import { TaskEntity } from "@/domain/task/types";

interface TasksSummaryProps {
  tasks: TaskEntity[];
}

export function TasksSummary({ tasks }: TasksSummaryProps) {
  const totalCount = tasks.length;
  const inProgressCount = tasks.filter((t) => t.status === "IN_PROGRESS" || t.status === "TODO").length;
  const urgentCount = tasks.filter((t) => t.priority === "URGENT" || t.priority === "HIGH").length;
  const completedCount = tasks.filter((t) => t.status === "COMPLETED").length;
  const waitingCount = tasks.filter((t) => t.status === "WAITING").length;

  const cards = [
    {
      title: "Total Tasks",
      value: totalCount.toString(),
      subtext: "Entire workload",
      icon: CheckSquare,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Pending & In-Progress",
      value: inProgressCount.toString(),
      subtext: "Active execution",
      icon: Clock,
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/20",
    },
    {
      title: "High & Urgent Priority",
      value: urgentCount.toString(),
      subtext: "Immediate focus",
      icon: Flame,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
    {
      title: "Completed",
      value: completedCount.toString(),
      subtext: "Closed tasks",
      icon: CheckCircle,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      title: "Waiting & Deferred",
      value: waitingCount.toString(),
      subtext: "Blocked on external",
      icon: AlertTriangle,
      color: "text-violet-400",
      bgColor: "bg-violet-500/10",
      borderColor: "border-violet-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="flex flex-col justify-between rounded-xl border border-zinc-800/80 bg-zinc-950 p-3.5 shadow-sm hover:border-zinc-700/80 transition-all select-none"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                {card.title}
              </span>
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-lg border ${card.bgColor} ${card.borderColor} ${card.color}`}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="mt-2">
              <div className="text-base font-extrabold font-mono text-white tracking-tight">
                {card.value}
              </div>
              <span className="text-[10px] text-zinc-500">{card.subtext}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
