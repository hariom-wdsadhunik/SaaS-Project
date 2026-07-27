import * as React from "react";
import { LucideIcon, TrendingUp, TrendingDown, Minus, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  period?: string;
  icon: LucideIcon;
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  trend = "up",
  period = "vs last month",
  icon: Icon,
  isLoading = false,
  isError = false,
  isEmpty = false,
  className,
}: StatCardProps) {
  if (isLoading) {
    return (
      <Card className={cn("border-zinc-800 bg-zinc-900/60 p-6 space-y-3", className)}>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-3 w-20" />
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className={cn("border-red-500/30 bg-red-500/5 p-6", className)}>
        <div className="flex items-center gap-2 text-xs font-semibold text-red-400">
          <AlertCircle className="h-4 w-4" />
          <span>Failed to load metric</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("border-zinc-800/80 bg-zinc-900/80 p-6 shadow-sm hover:border-zinc-700 transition-colors", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-400">{title}</span>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800/80 text-zinc-300 border border-zinc-700/60">
          <Icon className="h-4.5 w-4.5 text-indigo-400" />
        </div>
      </div>

      <div className="mt-3">
        {isEmpty ? (
          <span className="text-sm font-medium text-zinc-500">No data recorded</span>
        ) : (
          <div className="text-2xl font-bold tracking-tight text-white font-mono">{value}</div>
        )}
      </div>

      {!isEmpty && change && (
        <div className="mt-2 flex items-center gap-2 text-xs">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 font-semibold text-[11px]",
              trend === "up" && "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
              trend === "down" && "bg-red-500/10 text-red-400 border border-red-500/20",
              trend === "neutral" && "bg-zinc-800 text-zinc-400"
            )}
          >
            {trend === "up" && <TrendingUp className="h-3 w-3 mr-0.5" />}
            {trend === "down" && <TrendingDown className="h-3 w-3 mr-0.5" />}
            {trend === "neutral" && <Minus className="h-3 w-3 mr-0.5" />}
            {change}
          </span>
          <span className="text-[11px] text-zinc-500">{period}</span>
        </div>
      )}
    </Card>
  );
}
