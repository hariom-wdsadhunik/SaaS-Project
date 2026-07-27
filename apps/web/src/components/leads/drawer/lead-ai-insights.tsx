import * as React from "react";
import { Sparkles, AlertTriangle, ArrowRight, ShieldCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface LeadAIInsightsProps {
  leadName: string;
  score: number;
}

export function LeadAIInsights({ leadName, score }: LeadAIInsightsProps) {
  return (
    <Card className="border-violet-500/30 bg-gradient-to-br from-violet-950/20 via-zinc-900 to-indigo-950/20 p-4 shadow-md">
      <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-violet-400" />
          <CardTitle className="text-xs font-semibold text-white">AI Deal Copilot Summary</CardTitle>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          High Buyer Intent Signal
        </span>
      </CardHeader>

      <CardContent className="p-0 space-y-2.5 text-xs text-zinc-300">
        <p className="text-[11px] leading-relaxed text-zinc-300">
          <span className="font-semibold text-white">{leadName}</span> demonstrated a propensity score of{" "}
          <span className="font-bold text-violet-300 font-mono">{score}/100</span> based on 4 WhatsApp message exchanges and high interest in Downtown 3-bedroom villas.
        </p>

        {/* Risk Warning Alert */}
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 p-2 text-[11px] text-amber-300">
          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
          <span>SLA Warning: No broker call logged in the last 48 hours.</span>
        </div>

        {/* Action Trigger */}
        <div className="flex items-center justify-between pt-1 border-t border-zinc-800">
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
            <span>Recommended Next Step:</span>
          </div>
          <Button
            size="sm"
            variant="ai"
            onClick={() => toast.success(`Automated Property Matching Drip sent to ${leadName}`)}
            className="h-6 text-[10px] px-2"
          >
            <span>Send Drip</span>
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
