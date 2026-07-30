"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReportingEngine } from "@/domain/reporting/ReportingEngine";
import { BarChart3, ArrowUpRight, ArrowDownRight, Calendar, Download, Plus } from "lucide-react";
import { toast } from "sonner";

export default function ReportsHubPage() {
  const kpis = ReportingEngine.getKpis();

  const handleQuickExport = (format: string) => {
    toast.success(`Generated ${format} report export`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-zinc-800/80 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-400" />
            Enterprise Business Intelligence &amp; Reporting Hub
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time multi-dimensional analytics, executive dashboards, custom builders, and automated exports
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/reports/custom">
            <Button variant="primary" size="sm">
              <Plus className="w-4 h-4 mr-2" /> Custom Dashboard
            </Button>
          </Link>
          <Link href="/reports/scheduled">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2 text-amber-400" /> Scheduled Reports
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={() => handleQuickExport("PDF")}>
            <Download className="w-4 h-4 mr-2 text-emerald-400" /> Quick PDF Export
          </Button>
        </div>
      </div>

      {/* Dashboard Sub-App Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/reports/executive">
          <Card className="p-6 bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-colors space-y-3 group">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white group-hover:text-indigo-400">Executive Dashboard</span>
              <Badge variant="emerald">Live Data</Badge>
            </div>
            <p className="text-xs text-zinc-400">ARR, MRR, Gross Revenue, Churn &amp; High-Level Forecasts</p>
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold pt-2">
              View Executive Brief <ArrowUpRight className="w-4 h-4" />
            </div>
          </Card>
        </Link>

        <Link href="/reports/sales">
          <Card className="p-6 bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-colors space-y-3 group">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white group-hover:text-blue-400">Sales Performance</span>
              <Badge variant="emerald">Live Data</Badge>
            </div>
            <p className="text-xs text-zinc-400">Pipeline Velocity, Conversion Rates, Deal Stages &amp; Leaderboard</p>
            <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold pt-2">
              View Sales Analytics <ArrowUpRight className="w-4 h-4" />
            </div>
          </Card>
        </Link>

        <Link href="/reports/finance">
          <Card className="p-6 bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-colors space-y-3 group">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white group-hover:text-emerald-400">Financial Intelligence</span>
              <Badge variant="emerald">Live Data</Badge>
            </div>
            <p className="text-xs text-zinc-400">Subscription Plans, Billing Cycles, Invoices &amp; Revenue Retention</p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold pt-2">
              View Finance Breakdown <ArrowUpRight className="w-4 h-4" />
            </div>
          </Card>
        </Link>
      </div>

      {/* KPI Metric Matrix */}
      <Card className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4">
        <h2 className="text-base font-semibold text-white">16-Metric Key Performance Indicator (KPI) Library</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {kpis.map((kpi) => (
            <div key={kpi.id} className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 space-y-1">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>{kpi.name}</span>
                <Badge variant="zinc">{kpi.category}</Badge>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-xl font-bold text-white">{kpi.formattedValue}</span>
                <div className={`flex items-center gap-1 text-xs font-semibold ${kpi.trend === "UP" ? "text-emerald-400" : "text-rose-400"}`}>
                  {kpi.trend === "UP" ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  <span>{kpi.changePercentage > 0 ? `+${kpi.changePercentage}%` : `${kpi.changePercentage}%`}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
