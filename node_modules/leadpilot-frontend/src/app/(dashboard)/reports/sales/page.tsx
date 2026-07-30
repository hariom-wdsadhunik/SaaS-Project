"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart3, Download } from "lucide-react";
import { toast } from "sonner";

export default function SalesPerformancePage() {
  const handleExport = () => {
    toast.success("Exported Sales Performance report to Excel");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-zinc-800/80 pb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/reports">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Hub
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-400" />
              Sales Performance &amp; Funnel Analytics
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Pipeline conversion velocity, deal stage breakdown, and representative leaderboard
            </p>
          </div>
        </div>

        <Button variant="primary" size="sm" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" /> Export Excel
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-zinc-900/80 border border-zinc-800 space-y-1">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Pipeline Volume</p>
          <p className="text-2xl font-bold text-white">$84.5M</p>
          <p className="text-[11px] text-emerald-400">142 Active Deals</p>
        </Card>
        <Card className="p-4 bg-zinc-900/80 border border-zinc-800 space-y-1">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Conversion Rate</p>
          <p className="text-2xl font-bold text-white">35.2%</p>
          <p className="text-[11px] text-emerald-400">+4.1% vs target</p>
        </Card>
        <Card className="p-4 bg-zinc-900/80 border border-zinc-800 space-y-1">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Avg Sales Velocity</p>
          <p className="text-2xl font-bold text-white">18.4 Days</p>
          <p className="text-[11px] text-blue-400">-3.7 days cycle time</p>
        </Card>
        <Card className="p-4 bg-zinc-900/80 border border-zinc-800 space-y-1">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Deals Won (YTD)</p>
          <p className="text-2xl font-bold text-emerald-400">35 Closed</p>
          <p className="text-[11px] text-zinc-400">$32.2M Closed Volume</p>
        </Card>
      </div>

      {/* Pipeline Funnel Visualizer */}
      <Card className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4">
        <h2 className="text-base font-semibold text-white">Interactive Deal Pipeline Funnel</h2>
        <div className="h-64 bg-zinc-950 rounded-lg border border-zinc-800 flex items-center justify-center text-zinc-500 text-xs font-mono">
          [Funnel &amp; Kanban Chart Component: Lead -&gt; Qualified -&gt; Proposal -&gt; Closing -&gt; Won]
        </div>
      </Card>
    </div>
  );
}
