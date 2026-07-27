"use client";

import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HealthScoreEngine } from "@/platform/support/HealthScoreEngine";

export default function CustomerHealthDashboardPage() {
  const engine = new HealthScoreEngine();
  const health = engine.calculateScore({
    loginFrequencyDaysPerWeek: 6,
    featureAdoptionCount: 7,
    monthlyAiQueries: 140,
    monthlyWorkflowRuns: 320,
    openUnresolvedTickets: 0,
    storageUtilizationPercentage: 45,
    onboardingCompleted: true,
  });

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center border-b border-zinc-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Customer Health Score Engine</h1>
            <p className="text-xs text-zinc-400">Telemetry analytics, feature adoption metrics, and churn risk scoring.</p>
          </div>
          <Badge variant={health.status === "HEALTHY" ? "emerald" : "rose"}>
            Status: {health.status}
          </Badge>
        </div>

        {/* Health Score Banner */}
        <Card className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-zinc-900 border-zinc-800">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400">Account Health Index</span>
            <div className="text-6xl font-black text-white">{health.score} / 100</div>
            <p className="text-sm text-emerald-400 font-medium">{health.recommendation}</p>
          </div>

          <div className="w-full md:w-80 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-400">Login Cadence:</span>
              <span className="text-white font-bold">{health.breakdown.loginScore} / 25 pts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Feature Adoption:</span>
              <span className="text-white font-bold">{health.breakdown.adoptionScore} / 25 pts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">AI Engagement:</span>
              <span className="text-white font-bold">{health.breakdown.aiUsageScore} / 20 pts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Workflow Automation:</span>
              <span className="text-white font-bold">{health.breakdown.workflowScore} / 20 pts</span>
            </div>
            <div className="flex justify-between border-t border-zinc-800 pt-1">
              <span className="text-zinc-400">Onboarding Bonus:</span>
              <span className="text-emerald-400 font-bold">+{health.breakdown.onboardingBonus} pts</span>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
