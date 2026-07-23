"use client";

import * as React from "react";
import { Sparkles, ArrowRight, Zap, MessageSquare, Calendar } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  type: "whatsapp" | "sequence" | "appointment";
  impact: string;
  targetId: string;
}

const mockRecommendations: AIRecommendation[] = [
  {
    id: "rec-1",
    title: "High Buyer Propensity: John Doe (Score 88/100)",
    description: "Matched 3 luxury villas in Downtown under $1.5M. High engagement velocity.",
    type: "whatsapp",
    impact: "+45% Close Chance",
    targetId: "lead-101",
  },
  {
    id: "rec-2",
    title: "Stale Deal Warning: Marina Heights Unit #402",
    description: "No activity in 4 days. AI recommends sending automated contract progress nudge.",
    type: "sequence",
    impact: "Prevent Lead Churn",
    targetId: "deal-204",
  },
  {
    id: "rec-3",
    title: "Optimal Viewing Time for Sarah Jenkins",
    description: "Client preferred viewing windows identified as Saturday 2:00 PM.",
    type: "appointment",
    impact: "Automated iCal Invite",
    targetId: "lead-102",
  },
];

export function AIRecommendationPanel() {
  const handleExecuteAction = (rec: AIRecommendation) => {
    toast.success(`AI Action Triggered: ${rec.title}`, {
      description: "Executing sequence and updating lead log...",
    });
  };

  return (
    <Card className="border-violet-500/30 bg-gradient-to-br from-violet-950/30 via-zinc-900/90 to-indigo-950/20 p-6 shadow-lg shadow-violet-500/5">
      <CardHeader className="p-0 pb-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/20">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-white">AI Deal Copilot Recommendations</CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Autonomous sales actions prioritized by lead score velocity
            </CardDescription>
          </div>
        </div>
        <span className="hidden sm:inline-flex rounded-full bg-violet-500/20 px-2.5 py-1 text-[11px] font-semibold text-violet-300 border border-violet-500/30">
          3 Real-Time Action Signals
        </span>
      </CardHeader>

      <CardContent className="p-0 space-y-3">
        {mockRecommendations.map((rec) => (
          <div
            key={rec.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3.5 hover:border-violet-500/40 transition-colors gap-3"
          >
            <div className="flex items-start gap-3">
              {rec.type === "whatsapp" && <MessageSquare className="h-4 w-4 text-indigo-400 mt-1 shrink-0" />}
              {rec.type === "sequence" && <Zap className="h-4 w-4 text-amber-400 mt-1 shrink-0" />}
              {rec.type === "appointment" && <Calendar className="h-4 w-4 text-emerald-400 mt-1 shrink-0" />}
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-zinc-200">{rec.title}</p>
                <p className="text-[11px] text-zinc-400">{rec.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
              <span className="text-[10px] font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {rec.impact}
              </span>
              <Button
                size="sm"
                variant="ai"
                onClick={() => handleExecuteAction(rec)}
                className="h-7 text-xs px-2.5"
              >
                <span>Execute</span>
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
