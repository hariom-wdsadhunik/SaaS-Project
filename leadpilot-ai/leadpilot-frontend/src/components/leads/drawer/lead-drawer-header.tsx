import * as React from "react";
import { X, MessageSquare, PhoneCall, Mail, Sparkles, Building } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LeadItem } from "../lead-feedback";
import { toast } from "sonner";

interface LeadDrawerHeaderProps {
  lead: LeadItem;
  onClose: () => void;
}

export function LeadDrawerHeader({ lead, onClose }: LeadDrawerHeaderProps) {
  return (
    <div className="border-b border-zinc-800/80 bg-zinc-950 p-6 space-y-4">
      {/* Top Bar: Close Button & Org Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Building className="h-3.5 w-3.5 text-indigo-400" />
          <span>Apex Real Estate Workspace</span>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          title="Close Drawer (Esc)"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Main Profile Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <Avatar src={lead.avatarUrl} fallback={lead.fullName[0]} size="lg" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">{lead.fullName}</h2>
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
            <p className="text-xs text-zinc-400 font-mono">
              {lead.email || "No email"} • {lead.phone || "No phone"}
            </p>
          </div>
        </div>

        {/* AI Propensity Score Gauge */}
        <div className="flex items-center gap-3 rounded-xl border border-violet-500/30 bg-violet-500/10 p-3 self-start sm:self-auto">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white shrink-0">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] uppercase font-semibold text-violet-300 tracking-wider">
                AI Propensity
              </span>
            </div>
            <span className="text-lg font-bold font-mono text-white leading-none">
              {lead.aiPropensityScore}<span className="text-xs text-violet-400">/100</span>
            </span>
          </div>
        </div>
      </div>

      {/* Quick Interaction Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/60">
        <Button
          size="sm"
          variant="outline"
          onClick={() => toast.info(`Launching WhatsApp chat with ${lead.fullName}`)}
          className="h-8 text-xs gap-1.5"
        >
          <MessageSquare className="h-3.5 w-3.5 text-indigo-400" />
          <span>WhatsApp</span>
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => toast.info(`Dialing ${lead.phone || lead.fullName}`)}
          className="h-8 text-xs gap-1.5"
        >
          <PhoneCall className="h-3.5 w-3.5 text-emerald-400" />
          <span>Call</span>
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => toast.info(`Opening Email Composer for ${lead.email}`)}
          className="h-8 text-xs gap-1.5"
        >
          <Mail className="h-3.5 w-3.5 text-amber-400" />
          <span>Email</span>
        </Button>
      </div>
    </div>
  );
}
