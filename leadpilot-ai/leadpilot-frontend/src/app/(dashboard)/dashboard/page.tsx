"use client";

import * as React from "react";
import { Users, Briefcase, DollarSign, Sparkles, RefreshCw } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { LeadSourcesChart } from "@/components/dashboard/lead-sources-chart";
import { AIRecommendationPanel } from "@/components/dashboard/ai-recommendation-panel";
import { TodaySchedule } from "@/components/dashboard/today-schedule";
import { RecentActivityTimeline } from "@/components/dashboard/recent-activity-timeline";
import { QuickActionsGrid } from "@/components/dashboard/quick-actions-grid";
import { TaskWidgets } from "@/components/dashboard/task-widgets";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ExecutiveDashboardPage() {
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefreshData = () => {
    setIsRefreshing(true);
    toast.info("Refreshing real-time CRM analytics...");
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Dashboard Sync Complete");
    }, 800);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Executive Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Executive Control Panel</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real estate brokerage performance, pipeline velocity, and AI lead scoring metrics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshData}
            isLoading={isRefreshing}
            className="h-8 text-xs"
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            <span>Sync Data</span>
          </Button>

          <Button variant="ai" size="sm" className="h-8 text-xs">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            <span>AI Insights (⌘J)</span>
          </Button>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <QuickActionsGrid />

      {/* Primary KPI Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Buyers & Leads"
          value="248 Leads"
          change="+14.2%"
          trend="up"
          period="vs last month"
          icon={Users}
        />
        <StatCard
          title="Active Deals Pipeline"
          value="$4,250,000"
          change="+8.4%"
          trend="up"
          period="vs last month"
          icon={Briefcase}
        />
        <StatCard
          title="Monthly GCI Forecasted"
          value="$185,400"
          change="+22.1%"
          trend="up"
          period="vs target $150k"
          icon={DollarSign}
        />
        <StatCard
          title="AI Auto-Response Rate"
          value="98.4%"
          change="+3.1%"
          trend="up"
          period="sub-10s WhatsApp response"
          icon={Sparkles}
        />
      </div>

      {/* Operational Task Widgets (Sprint v0.5.0) */}
      <TaskWidgets />

      {/* Revenue Chart & Acquisition Channels (60/40 Split) */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <RevenueChart />
        </div>
        <div className="lg:col-span-5">
          <LeadSourcesChart />
        </div>
      </div>

      {/* AI Recommendation Signals */}
      <AIRecommendationPanel />

      {/* Today's Schedule & Live Workspace Activity (50/50 Split) */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TodaySchedule />
        <RecentActivityTimeline />
      </div>
    </div>
  );
}
