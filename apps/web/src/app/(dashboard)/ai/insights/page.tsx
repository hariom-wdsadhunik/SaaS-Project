"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AiIntelligenceEngine } from "@/domain/ai/AiIntelligenceEngine";
import { Target, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ExplainableAiInsightsPage() {
  const scores = AiIntelligenceEngine.getLeadScores();

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
              <Target className="w-6 h-6 text-emerald-400" />
              Explainable AI (XAI) Insights &amp; Feature Importance
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Transparent ML reasoning, feature weights, confidence metrics, and decision factors
            </p>
          </div>
        </div>
      </div>

      {/* XAI Factor Matrix */}
      <div className="space-y-6">
        {scores.map((item) => (
          <Card key={item.leadId} className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{item.leadName}</h3>
                  <Badge variant="ai">Score: {item.score}/100</Badge>
                  <Badge variant="emerald">Confidence: {item.confidence}%</Badge>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">{item.company}</p>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono text-zinc-500">
                  Calculated: {new Date(item.calculatedAt).toLocaleTimeString()}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Top Contributing Factors</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {item.contributingFactors.map((factor, idx) => (
                  <div key={idx} className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{factor.feature}</span>
                      <span className="font-mono text-emerald-400">+{factor.weight} pts</span>
                    </div>
                    <p className="text-xs text-zinc-400">{factor.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-indigo-950/40 rounded-lg border border-indigo-900/60 flex items-center justify-between">
              <span className="text-xs text-indigo-200 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" /> Prescriptive Action: {item.suggestedAction}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
