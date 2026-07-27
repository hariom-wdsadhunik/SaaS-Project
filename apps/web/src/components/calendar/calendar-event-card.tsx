import * as React from "react";
import { CalendarEventEntity } from "@/domain/calendar/types";
import { Clock, User, Link as LinkIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CalendarEventCardProps {
  event: CalendarEventEntity;
  onSelect?: (evt: CalendarEventEntity) => void;
}

export function CalendarEventCard({ event, onSelect }: CalendarEventCardProps) {
  const priorityVariantMap = {
    URGENT: "danger",
    HIGH: "warning",
    MEDIUM: "secondary",
    LOW: "default",
  } as const;

  const eventTypeColorMap: Record<string, string> = {
    PROPERTY_VISIT: "border-indigo-500/30 bg-indigo-500/10 text-indigo-300",
    MEETING: "border-pink-500/30 bg-pink-500/10 text-pink-300",
    FOLLOW_UP: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    TASK: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
  };

  const badgeStyle = eventTypeColorMap[event.eventType] || "border-zinc-800 bg-zinc-900 text-zinc-300";

  return (
    <div
      onClick={() => onSelect?.(event)}
      className="group relative rounded-xl border border-zinc-800 bg-zinc-950 p-4 hover:border-indigo-500/50 hover:shadow-lg transition-all duration-200 cursor-pointer space-y-3"
    >
      <div className="flex items-start justify-between gap-2">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${badgeStyle}`}>
          {event.eventType.replace("_", " ")}
        </span>
        <Badge variant={priorityVariantMap[event.priority]} className="text-[10px]">
          {event.priority}
        </Badge>
      </div>

      <div>
        <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
          {event.title}
        </h4>
        {event.description && (
          <p className="text-xs text-zinc-400 line-clamp-2 mt-1">{event.description}</p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-zinc-800/80 text-xs text-zinc-400 font-mono">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-indigo-400" />
          <span>
            {new Date(event.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>

        {event.relatedEntityName && (
          <div className="flex items-center gap-1.5 border-l border-zinc-800 pl-3">
            <LinkIcon className="h-3.5 w-3.5 text-indigo-400" />
            <span className="truncate max-w-[140px]">{event.relatedEntityName}</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 ml-auto">
          <User className="h-3.5 w-3.5 text-zinc-500" />
          <span className="text-zinc-300">{event.assignedAgentName}</span>
        </div>
      </div>
    </div>
  );
}
