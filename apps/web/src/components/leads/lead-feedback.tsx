import * as React from "react";
import { Users, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { formatCurrency } from "@/utils/formatters";

export function LeadLoadingSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-10 w-full rounded-xl" />
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-14 w-full rounded-xl" />
      ))}
    </div>
  );
}

export function LeadEmptyState({ onResetFilters }: { onResetFilters: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 p-12 text-center my-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 mb-4">
        <Users className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-white">No Leads Found</h3>
      <p className="text-xs text-zinc-400 max-w-sm mt-1 mb-4">
        No lead records matched your active filter criteria or search query.
      </p>
      <Button size="sm" variant="outline" onClick={onResetFilters} className="text-xs">
        Reset All Filters
      </Button>
    </div>
  );
}

export function LeadErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 p-12 text-center my-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 text-red-400 mb-4">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-red-200">Failed to Load Leads Data</h3>
      <p className="text-xs text-zinc-400 max-w-sm mt-1 mb-4">
        An error occurred while fetching the lead catalogue from the backend API.
      </p>
      <Button size="sm" variant="secondary" onClick={onRetry} className="text-xs gap-1.5">
        <RefreshCw className="h-3.5 w-3.5" />
        <span>Try Again</span>
      </Button>
    </div>
  );
}

export interface LeadItem {
  id: string;
  fullName: string;
  avatarUrl?: string;
  email: string;
  phone: string;
  source: string;
  status: "NEW" | "CONTACTED" | "QUALIFIED" | "NURTURING" | "LOST";
  aiPropensityScore: number;
  budgetMin: number;
  budgetMax: number;
  assignedBrokerName: string;
  createdAt: string;
}

export function LeadCardMobile({ lead }: { lead: LeadItem }) {
  return (
    <Card className="p-4 border-zinc-800 bg-zinc-900/80 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar src={lead.avatarUrl} fallback={lead.fullName[0]} size="md" />
          <div>
            <h4 className="text-sm font-semibold text-white">{lead.fullName}</h4>
            <p className="text-xs text-zinc-400">{lead.phone || lead.email}</p>
          </div>
        </div>
        <Badge
          variant={
            lead.status === "QUALIFIED"
              ? "success"
              : lead.status === "NEW"
              ? "default"
              : lead.status === "LOST"
              ? "danger"
              : "secondary"
          }
          className="text-[10px]"
        >
          {lead.status}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs border-t border-b border-zinc-800/80 py-2.5">
        <div>
          <span className="text-[10px] text-zinc-500 block">AI Propensity</span>
          <span className="font-mono font-bold text-violet-400">{lead.aiPropensityScore}/100</span>
        </div>
        <div>
          <span className="text-[10px] text-zinc-500 block">Budget Range</span>
          <span className="font-mono font-medium text-zinc-200">
            {formatCurrency(lead.budgetMin)} - {formatCurrency(lead.budgetMax)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-zinc-400">
        <span>Broker: {lead.assignedBrokerName}</span>
        <span className="text-[10px] text-zinc-500">{lead.source}</span>
      </div>
    </Card>
  );
}
