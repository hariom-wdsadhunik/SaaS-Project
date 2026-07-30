"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Download } from "lucide-react";
import { toast } from "sonner";

export default function ExecutiveDashboardPage() {
  const handleExport = () => {
    toast.success("Exported Executive Brief report to PDF");
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
              <TrendingUp className="w-6 h-6 text-indigo-400" />
              Executive Leadership Dashboard
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Board-level strategic indicators: ARR, MRR, Revenue Retention, and Pipeline Forecasts
            </p>
          </div>
        </div>

        <Button variant="primary" size="sm" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" /> Export Brief (PDF)
        </Button>
      </div>

      {/* KPI Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-zinc-900/80 border border-zinc-800 space-y-1">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Gross Annual Revenue</p>
          <p className="text-2xl font-bold text-white">$32.2M</p>
          <p className="text-[11px] text-emerald-400">+18.4% YoY Growth</p>
        </Card>
        <Card className="p-4 bg-zinc-900/80 border border-zinc-800 space-y-1">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Annual Recurring (ARR)</p>
          <p className="text-2xl font-bold text-white">$3.58M</p>
          <p className="text-[11px] text-emerald-400">+12.8% Run-rate</p>
        </Card>
        <Card className="p-4 bg-zinc-900/80 border border-zinc-800 space-y-1">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Net Revenue Retention</p>
          <p className="text-2xl font-bold text-white">114.5%</p>
          <p className="text-[11px] text-blue-400">+5.8% Expansion</p>
        </Card>
        <Card className="p-4 bg-zinc-900/80 border border-zinc-800 space-y-1">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Gross Churn Rate</p>
          <p className="text-2xl font-bold text-emerald-400">1.2%</p>
          <p className="text-[11px] text-emerald-400">-0.6% vs target</p>
        </Card>
      </div>

      {/* Visual Chart Placeholder Card */}
      <Card className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4">
        <h2 className="text-base font-semibold text-white">Annual Growth &amp; Forecast Visualizer</h2>
        <div className="h-64 bg-zinc-950 rounded-lg border border-zinc-800 flex items-center justify-center text-zinc-500 text-xs font-mono">
          [Interactive Line &amp; Area Chart Component: Revenue Growth $32.2M Trend]
        </div>
      </Card>
    </div>
  );
}
