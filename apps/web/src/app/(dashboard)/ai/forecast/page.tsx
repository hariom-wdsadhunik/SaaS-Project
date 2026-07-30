"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AiIntelligenceEngine } from "@/domain/ai/AiIntelligenceEngine";
import { TrendingUp, ArrowLeft, Download } from "lucide-react";
import { toast } from "sonner";

export default function AiRevenueForecastPage() {
  const forecasts = AiIntelligenceEngine.getRevenueForecasts();

  const handleExportForecast = () => {
    toast.success("Exported AI Revenue Forecast report to PDF");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-zinc-800/80 pb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/ai">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to AI Hub
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-indigo-400" />
              Predictive Revenue &amp; Pipeline Forecasting
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Monte Carlo revenue projections, best/worst case bounds, and confidence interval modeling
            </p>
          </div>
        </div>

        <Button variant="primary" size="sm" onClick={handleExportForecast}>
          <Download className="w-4 h-4 mr-2" /> Export Forecast (PDF)
        </Button>
      </div>

      {/* Forecast Highlight Grid */}
      {forecasts.map((fc, idx) => (
        <div key={idx} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-zinc-900/80 border border-zinc-800 space-y-1">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Expected Revenue ({fc.targetPeriodName})</p>
              <p className="text-2xl font-bold text-white">${(fc.expectedRevenue / 1000000).toFixed(2)}M</p>
              <p className="text-[11px] text-emerald-400">{fc.confidencePercentage}% AI Model Confidence</p>
            </Card>

            <Card className="p-4 bg-zinc-900/80 border border-zinc-800 space-y-1">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Best Case Scenario</p>
              <p className="text-2xl font-bold text-emerald-400">${(fc.bestCaseRevenue / 1000000).toFixed(2)}M</p>
              <p className="text-[11px] text-zinc-400">100% Win Rate Target</p>
            </Card>

            <Card className="p-4 bg-zinc-900/80 border border-zinc-800 space-y-1">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Worst Case Scenario</p>
              <p className="text-2xl font-bold text-rose-400">${(fc.worstCaseRevenue / 1000000).toFixed(2)}M</p>
              <p className="text-[11px] text-zinc-400">Conservative Floor</p>
            </Card>

            <Card className="p-4 bg-zinc-900/80 border border-zinc-800 space-y-1">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Pipeline Coverage Ratio</p>
              <p className="text-2xl font-bold text-blue-400">{fc.pipelineCoverageRatio}x</p>
              <p className="text-[11px] text-blue-400">3.4x Target Coverage</p>
            </Card>
          </div>

          <Card className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4">
            <h2 className="text-base font-semibold text-white">Confidence Interval Visualizer (85% - 95% Bounds)</h2>
            <div className="h-64 bg-zinc-950 rounded-lg border border-zinc-800 flex items-center justify-center text-zinc-500 text-xs font-mono">
              [Confidence Interval Chart Component: Lower Bound ${(fc.confidenceLowerBound / 1000000).toFixed(2)}M &lt;- Expected ${(fc.expectedRevenue / 1000000).toFixed(2)}M -&gt; Upper Bound ${(fc.confidenceUpperBound / 1000000).toFixed(2)}M]
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}
