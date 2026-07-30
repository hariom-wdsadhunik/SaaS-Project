"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AiIntelligenceEngine } from "@/domain/ai/AiIntelligenceEngine";
import { Zap, ArrowLeft, Send } from "lucide-react";
import { toast } from "sonner";

export default function AiRecommendationsPage() {
  const actions = AiIntelligenceEngine.getNextBestActions();

  const handleExecuteAction = (actionTitle: string) => {
    toast.success(`Executed action: "${actionTitle}"`);
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
              <Zap className="w-6 h-6 text-amber-400" />
              Next Best Action &amp; Follow-up Recommendations
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Prescriptive sales guidance, timing optimization, and automated action triggers
            </p>
          </div>
        </div>

        <Badge variant="amber">{actions.length} Action Item(s)</Badge>
      </div>

      {/* Action Cards List */}
      <div className="space-y-4">
        {actions.map((item) => (
          <Card key={item.id} className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={item.priority === "CRITICAL" ? "rose" : "amber"}>{item.priority}</Badge>
                  <h3 className="text-base font-bold text-white">{item.entityName}</h3>
                  <Badge variant="zinc">{item.entityType}</Badge>
                </div>
                <p className="text-sm font-semibold text-amber-400">{item.recommendedAction}</p>
                <p className="text-xs text-zinc-400">{item.reasoning}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs font-semibold text-emerald-400 block">{item.expectedImpact}</span>
                  <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-mono">Urgency: {item.urgency}</span>
                </div>
                <Button variant="primary" size="sm" onClick={() => handleExecuteAction(item.recommendedAction)}>
                  <Send className="w-3.5 h-3.5 mr-1.5" /> Execute Action
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
