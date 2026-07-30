"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AiIntelligenceEngine } from "@/domain/ai/AiIntelligenceEngine";
import { Brain, ArrowLeft } from "lucide-react";

export default function PredictiveScoringConsolePage() {
  const scores = AiIntelligenceEngine.getLeadScores();
  const predictions = AiIntelligenceEngine.getDealPredictions();

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
              <Brain className="w-6 h-6 text-purple-400" />
              Predictive Lead &amp; Opportunity Scoring Console
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Automated propensity scoring, engagement velocity, and win likelihood modeling
            </p>
          </div>
        </div>
      </div>

      {/* Lead Scores Grid */}
      <Card className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4">
        <h2 className="text-base font-semibold text-white">Lead Propensity Scores (Top Accounts)</h2>

        <div className="divide-y divide-zinc-800/80">
          {scores.map((lead) => (
            <div key={lead.leadId} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="ai" className="font-bold">
                    Grade {lead.grade} ({lead.score}/100)
                  </Badge>
                  <p className="text-sm font-semibold text-white">{lead.leadName}</p>
                  <span className="text-xs text-zinc-400">({lead.company})</span>
                </div>
                <p className="text-xs text-zinc-400">{lead.summary}</p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="emerald">{lead.confidence}% Confidence</Badge>
                <Link href="/ai/insights">
                  <Button variant="outline" size="sm" className="text-xs">
                    View XAI Factors
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Deal Win Probability Table */}
      <Card className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4">
        <h2 className="text-base font-semibold text-white">Opportunity Win Probability &amp; Churn Risk</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3">Opportunity Name</th>
                <th className="py-2.5 px-3">Deal Value</th>
                <th className="py-2.5 px-3">Win Probability</th>
                <th className="py-2.5 px-3">Churn Risk</th>
                <th className="py-2.5 px-3">Health Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {predictions.map((deal) => (
                <tr key={deal.dealId} className="hover:bg-zinc-800/40">
                  <td className="py-3 px-3 font-semibold text-white">{deal.dealName}</td>
                  <td className="py-3 px-3 font-mono text-emerald-400">${(deal.amount / 1000).toFixed(0)}K</td>
                  <td className="py-3 px-3 font-bold text-indigo-400">{deal.winProbabilityPercentage}%</td>
                  <td className={`py-3 px-3 font-bold ${deal.churnRiskPercentage > 20 ? "text-rose-400" : "text-emerald-400"}`}>
                    {deal.churnRiskPercentage}%
                  </td>
                  <td className="py-3 px-3">
                    <Badge variant={deal.healthStatus === "HEALTHY" ? "emerald" : "rose"}>{deal.healthStatus}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
