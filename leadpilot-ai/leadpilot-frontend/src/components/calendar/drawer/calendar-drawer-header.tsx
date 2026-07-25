import * as React from "react";
import { X, Clock, Edit3, Link as LinkIcon, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CalendarEventEntity } from "@/domain/calendar/types";
import { EntityStatusBadge } from "@/platform/ui/entity-status-badge";
import { formatDate } from "@/utils/formatters";
import { toast } from "sonner";

interface CalendarDrawerHeaderProps {
  event: CalendarEventEntity;
  onClose: () => void;
  onEdit?: () => void;
}

export function CalendarDrawerHeader({ event, onClose, onEdit }: CalendarDrawerHeaderProps) {
  const priorityVariantMap = {
    URGENT: "danger",
    HIGH: "warning",
    MEDIUM: "secondary",
    LOW: "default",
  } as const;

  return (
    <div className="border-b border-zinc-800/80 bg-zinc-950 p-6 space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">
            {event.eventType.replace("_", " ")}
          </span>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          title="Close Drawer (Esc)"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Identity & Status */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-white">{event.title}</h2>
          <Badge variant={priorityVariantMap[event.priority]} className="text-[10px]">
            {event.priority}
          </Badge>
          <EntityStatusBadge status={event.status} />
        </div>
        {event.description && <p className="text-xs text-zinc-400">{event.description}</p>}
      </div>

      {/* Schedule & Host Broker Info */}
      <div className="flex flex-wrap items-center gap-3 border-t border-b border-zinc-800/80 py-2.5 text-xs text-zinc-300 font-mono">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-indigo-400" />
          <span>Start: {formatDate(event.start)}</span>
        </div>
        {event.relatedEntityName && (
          <div className="flex items-center gap-1.5 border-l border-zinc-800 pl-3">
            <LinkIcon className="h-3.5 w-3.5 text-indigo-400" />
            <span className="truncate">{event.relatedEntityName}</span>
          </div>
        )}
      </div>

      {/* Quick Action Triggers */}
      <div className="flex items-center justify-between pt-1 text-xs">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.success(`Event "${event.title}" marked as COMPLETED`)}
            className="h-8 text-xs gap-1.5"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>Mark Complete</span>
          </Button>
          <Button size="sm" variant="outline" onClick={onEdit} className="h-8 text-xs gap-1.5">
            <Edit3 className="h-3.5 w-3.5 text-indigo-400" />
            <span>Edit Event</span>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Avatar src="" fallback={event.assignedAgentName[0]} size="sm" />
          <span className="text-xs text-zinc-300 font-mono hidden sm:inline">
            {event.assignedAgentName}
          </span>
        </div>
      </div>
    </div>
  );
}
