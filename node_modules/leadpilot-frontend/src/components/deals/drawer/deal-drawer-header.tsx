import * as React from "react";
import { X, Building, DollarSign, Sparkles, MessageSquare, PhoneCall, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatters";
import { DealItem } from "@/services/deal-mock-service";
import { toast } from "sonner";

interface DealDrawerHeaderProps {
  deal: DealItem;
  onClose: () => void;
}

export function DealDrawerHeader({ deal, onClose }: DealDrawerHeaderProps) {
  return (
    <div className="border-b border-zinc-800/80 bg-zinc-950 p-6 space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Building className="h-3.5 w-3.5 text-indigo-400" />
          <span>{deal.companyName || "Apex Real Estate Workspace"}</span>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          title="Close Drawer (Esc)"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">{deal.title}</h2>
            <Badge variant="default" className="text-[10px]">
              {deal.stage}
            </Badge>
          </div>
          <p className="text-xs text-zinc-400 font-mono">
            Lead Contact: {deal.contactName} • Agent: {deal.assignedAgentName}
          </p>
        </div>

        {/* Value Gauge */}
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <DollarSign className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-emerald-300 tracking-wider">
              Deal Value
            </span>
            <div className="text-lg font-extrabold font-mono text-white leading-none">
              {formatCurrency(deal.value)}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Triggers */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-xs">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.info(`WhatsApp chat opened for ${deal.contactName}`)}
            className="h-8 text-xs gap-1.5"
          >
            <MessageSquare className="h-3.5 w-3.5 text-indigo-400" />
            <span>WhatsApp</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.info(`Initiating call to ${deal.contactName}`)}
            className="h-8 text-xs gap-1.5"
          >
            <PhoneCall className="h-3.5 w-3.5 text-emerald-400" />
            <span>Call</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.info(`Email composer opened for ${deal.contactName}`)}
            className="h-8 text-xs gap-1.5"
          >
            <Mail className="h-3.5 w-3.5 text-amber-400" />
            <span>Email</span>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-violet-300 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-violet-400" />
            <span>Win Prob: {deal.probability}%</span>
          </span>
          <Avatar src={deal.agentAvatarUrl} fallback={deal.assignedAgentName[0]} size="sm" />
        </div>
      </div>
    </div>
  );
}
