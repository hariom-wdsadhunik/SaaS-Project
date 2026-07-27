import * as React from "react";
import {
  Building,
  User,
  Calendar,
  Sparkles,
  MoreHorizontal,
  MessageSquare,
  PhoneCall,
  Trash2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { DealItem } from "@/services/deal-mock-service";
import { toast } from "sonner";

interface DealCardProps {
  deal: DealItem;
  onDragStart: (e: React.DragEvent, dealId: string) => void;
  onSelectDeal?: (deal: DealItem) => void;
  onDeleteDeal?: (deal: DealItem) => void;
}

export function DealCard({ deal, onDragStart, onSelectDeal, onDeleteDeal }: DealCardProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const priorityVariantMap = {
    URGENT: "danger",
    HIGH: "warning",
    NORMAL: "secondary",
    LOW: "default",
  } as const;

  return (
    <Card
      draggable
      onDragStart={(e) => onDragStart(e, deal.id)}
      onClick={() => onSelectDeal?.(deal)}
      className="p-3.5 border-zinc-800/80 bg-zinc-900/90 hover:border-zinc-700 hover:bg-zinc-900 shadow-sm space-y-3 cursor-grab active:cursor-grabbing transition-all select-none group relative"
    >
      {/* Top Header: Title & Menu */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
            {deal.title}
          </h4>
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mt-0.5">
            <Building className="h-3 w-3 text-zinc-500 shrink-0" />
            <span className="truncate">{deal.companyName}</span>
          </div>
        </div>

        {/* Priority Badge & Action Toggle */}
        <div className="flex items-center gap-1 shrink-0">
          <Badge variant={priorityVariantMap[deal.priority]} className="text-[9px] px-1.5 py-0">
            {deal.priority}
          </Badge>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-white"
            aria-label={`Actions for ${deal.title}`}
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-2 top-8 w-40 rounded-xl border border-zinc-800 bg-zinc-950 p-1 shadow-2xl z-20 animate-in fade-in duration-100">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(false);
                  onSelectLeadDrawer(deal, onSelectDeal);
                }}
                className="flex w-full items-center gap-2 px-2.5 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 rounded-lg text-left"
              >
                <User className="h-3.5 w-3.5 text-indigo-400" />
                <span>View Workspace</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(false);
                  toast.info(`Opening WhatsApp chat for ${deal.contactName}`);
                }}
                className="flex w-full items-center gap-2 px-2.5 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 rounded-lg text-left"
              >
                <MessageSquare className="h-3.5 w-3.5 text-indigo-400" />
                <span>WhatsApp</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(false);
                  toast.info(`Calling ${deal.contactName}`);
                }}
                className="flex w-full items-center gap-2 px-2.5 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 rounded-lg text-left"
              >
                <PhoneCall className="h-3.5 w-3.5 text-emerald-400" />
                <span>Call Lead</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(false);
                  onDeleteDeal?.(deal);
                }}
                className="flex w-full items-center gap-2 px-2.5 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg text-left border-t border-zinc-800/60 mt-1 pt-1.5"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Deal</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Middle: Value & Lead Contact */}
      <div className="flex items-center justify-between border-t border-b border-zinc-800/80 py-2">
        <div>
          <span className="text-[10px] text-zinc-500 block uppercase font-medium">Deal Value</span>
          <span className="text-sm font-extrabold font-mono text-emerald-400">
            {formatCurrency(deal.value)}
          </span>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-zinc-500 block uppercase font-medium">Contact</span>
          <span className="text-xs text-zinc-300 flex items-center justify-end gap-1">
            <User className="h-3 w-3 text-zinc-500" />
            <span>{deal.contactName}</span>
          </span>
        </div>
      </div>

      {/* Footer: Close Date, Agent, Probability */}
      <div className="flex items-center justify-between text-xs text-zinc-400 pt-0.5">
        <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-400">
          <Calendar className="h-3 w-3 text-zinc-500" />
          <span>{formatDate(deal.expectedCloseDate)}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Win Probability Pill */}
          <span className="text-[10px] font-mono text-violet-300 bg-violet-500/10 border border-violet-500/20 px-1.5 py-0.5 rounded flex items-center gap-1">
            <Sparkles className="h-2.5 w-2.5 text-violet-400" />
            {deal.probability}%
          </span>

          {/* Assigned Agent Avatar */}
          <Avatar
            src={deal.agentAvatarUrl}
            fallback={deal.assignedAgentName[0]}
            size="sm"
          />
        </div>
      </div>
    </Card>
  );
}

function onSelectLeadDrawer(deal: DealItem, callback?: (deal: DealItem) => void) {
  callback?.(deal);
}
