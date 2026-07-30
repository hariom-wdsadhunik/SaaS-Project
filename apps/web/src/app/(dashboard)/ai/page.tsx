"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AiIntelligenceEngine } from "@/domain/ai/AiIntelligenceEngine";
import { Sparkles, Brain, TrendingUp, Target, Zap, ArrowUpRight, ShieldAlert } from "lucide-react";

export default function AiPlatformOverviewPage() {
  const nextActions = AiIntelligenceEngine.getNextBestActions();
  const predictions = AiIntelligenceEngine.getDealPredictions();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-zinc-800/80 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            Enterprise AI Intelligence Platform
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Predictive lead scoring, revenue forecasting, next best action engine, and explainable AI insights
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="ai" className="px-3 py-1 text-xs">
            AI Engine v3.7 Active
          </Badge>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link href="/ai/leads">
          <Card className="p-5 bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-colors space-y-2 group">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white group-hover:text-purple-400 flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-purple-400" /> Predictive Scoring
              </span>
              <ArrowUpRight className="w-4 h-4 text-zinc-500" />
            </div>
            <p className="text-xs text-zinc-400">Lead quality &amp; deal win probabilities</p>
          </Card>
        </Link>

        <Link href="/ai/forecast">
          <Card className="p-5 bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-colors space-y-2 group">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white group-hover:text-indigo-400 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-indigo-400" /> AI Forecast
              </span>
              <ArrowUpRight className="w-4 h-4 text-zinc-500" />
            </div>
            <p className="text-xs text-zinc-400">Revenue &amp; pipeline confidence bounds</p>
          </Card>
        </Link>

        <Link href="/ai/recommendations">
          <Card className="p-5 bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-colors space-y-2 group">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white group-hover:text-amber-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" /> Next Best Action
              </span>
              <ArrowUpRight className="w-4 h-4 text-zinc-500" />
            </div>
            <p className="text-xs text-zinc-400">Prescriptive sales &amp; follow-up actions</p>
          </Card>
        </Link>

        <Link href="/ai/insights">
          <Card className="p-5 bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-colors space-y-2 group">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white group-hover:text-emerald-400 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-emerald-400" /> Explainability
              </span>
              <ArrowUpRight className="w-4 h-4 text-zinc-500" />
            </div>
            <p className="text-xs text-zinc-400">XAI factors &amp; feature importance</p>
          </Card>
        </Link>
      </div>

      {/* Critical AI Actions & Predictions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Next Best Actions */}
        <Card className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" /> Priority Next Best Actions
            </h2>
            <Link href="/ai/recommendations">
              <Button variant="ghost" size="sm" className="text-xs text-amber-400">
                View All
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {nextActions.map((nba) => (
              <div key={nba.id} className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{nba.entityName}</span>
                  <Badge variant={nba.priority === "CRITICAL" ? "rose" : "amber"}>{nba.priority}</Badge>
                </div>
                <p className="text-xs text-amber-300 font-semibold">{nba.recommendedAction}</p>
                <p className="text-xs text-zinc-400">{nba.reasoning}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* High Risk / High Win Deals */}
        <Card className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" /> Deal Health Predictions
            </h2>
            <Link href="/ai/leads">
              <Button variant="ghost" size="sm" className="text-xs text-purple-400">
                View Console
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {predictions.map((deal) => (
              <div key={deal.dealId} className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{deal.dealName}</span>
                  <Badge variant={deal.healthStatus === "HEALTHY" ? "emerald" : "rose"}>
                    {deal.winProbabilityPercentage}% Win Prob
                  </Badge>
                </div>
                <p className="text-xs text-zinc-400 font-mono">Amount: ${(deal.amount / 1000).toFixed(0)}K</p>
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {deal.keyDrivers.map((driver, idx) => (
                    <Badge key={idx} variant="zinc" className="text-[10px]">
                      {driver}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
