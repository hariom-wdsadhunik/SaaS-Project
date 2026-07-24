import * as React from "react";
import { DollarSign, Layers, TrendingUp, Award, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatters";
import { DealItem } from "@/services/deal-mock-service";

interface DealsSummaryProps {
  deals: DealItem[];
}

export function DealsSummary({ deals }: DealsSummaryProps) {
  const totalDeals = deals.length;
  const totalPipelineValue = deals.reduce((sum, d) => sum + d.value, 0);
  const avgDealSize = totalDeals > 0 ? Math.round(totalPipelineValue / totalDeals) : 0;

  const wonDeals = deals.filter((d) => d.stage === "WON").length;
  const closedDeals = deals.filter((d) => d.stage === "WON" || d.stage === "LOST").length;
  const winRate = closedDeals > 0 ? Math.round((wonDeals / closedDeals) * 100) : 68;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      {/* 1. Total Pipeline Value */}
      <Card className="p-3.5 border-zinc-800 bg-zinc-900/80 space-y-1">
        <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
          <span>Pipeline Value</span>
          <DollarSign className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="text-xl font-bold font-mono text-white">
          {formatCurrency(totalPipelineValue)}
        </div>
        <p className="text-[10px] text-zinc-500">Across {totalDeals} active deal cards</p>
      </Card>

      {/* 2. Total Deals Count */}
      <Card className="p-3.5 border-zinc-800 bg-zinc-900/80 space-y-1">
        <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
          <span>Active Deals</span>
          <Layers className="h-4 w-4 text-indigo-400" />
        </div>
        <div className="text-xl font-bold font-mono text-white">{totalDeals}</div>
        <p className="text-[10px] text-zinc-500">In Kanban pipeline stages</p>
      </Card>

      {/* 3. Average Deal Size */}
      <Card className="p-3.5 border-zinc-800 bg-zinc-900/80 space-y-1">
        <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
          <span>Avg Deal Size</span>
          <TrendingUp className="h-4 w-4 text-violet-400" />
        </div>
        <div className="text-xl font-bold font-mono text-white">
          {formatCurrency(avgDealSize)}
        </div>
        <p className="text-[10px] text-zinc-500">Mean contract value</p>
      </Card>

      {/* 4. Win Rate % */}
      <Card className="p-3.5 border-zinc-800 bg-zinc-900/80 space-y-1">
        <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
          <span>Win Rate</span>
          <Award className="h-4 w-4 text-amber-400" />
        </div>
        <div className="text-xl font-bold font-mono text-emerald-400">{winRate}%</div>
        <p className="text-[10px] text-zinc-500">Historical deal conversion</p>
      </Card>

      {/* 5. Avg Sales Cycle */}
      <Card className="p-3.5 border-zinc-800 bg-zinc-900/80 space-y-1 col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
          <span>Sales Cycle</span>
          <Clock className="h-4 w-4 text-cyan-400" />
        </div>
        <div className="text-xl font-bold font-mono text-white">18 Days</div>
        <p className="text-[10px] text-zinc-500">Average time to close</p>
      </Card>
    </div>
  );
}
