import * as React from "react";
import { Calendar as CalendarIcon, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { CalendarEventEntity } from "@/domain/calendar/types";

interface CalendarSummaryProps {
  events: CalendarEventEntity[];
}

export function CalendarSummary({ events }: CalendarSummaryProps) {
  const totalEvents = events.length;
  const visitsCount = events.filter((e) => e.eventType === "PROPERTY_VISIT").length;
  const meetingsCount = events.filter((e) => e.eventType === "MEETING").length;
  const urgentCount = events.filter((e) => e.priority === "URGENT").length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950 p-4 space-y-1">
        <div className="flex items-center justify-between text-zinc-400 text-xs">
          <span>Total Scheduled Events</span>
          <CalendarIcon className="h-4 w-4 text-indigo-400" />
        </div>
        <div className="text-2xl font-bold text-white font-mono">{totalEvents}</div>
      </div>

      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950 p-4 space-y-1">
        <div className="flex items-center justify-between text-zinc-400 text-xs">
          <span>Property Tours</span>
          <Clock className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="text-2xl font-bold text-white font-mono">{visitsCount}</div>
      </div>

      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950 p-4 space-y-1">
        <div className="flex items-center justify-between text-zinc-400 text-xs">
          <span>Client Meetings</span>
          <CheckCircle2 className="h-4 w-4 text-cyan-400" />
        </div>
        <div className="text-2xl font-bold text-white font-mono">{meetingsCount}</div>
      </div>

      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950 p-4 space-y-1">
        <div className="flex items-center justify-between text-zinc-400 text-xs">
          <span>Urgent Priorities</span>
          <AlertCircle className="h-4 w-4 text-red-400" />
        </div>
        <div className="text-2xl font-bold text-red-400 font-mono">{urgentCount}</div>
      </div>
    </div>
  );
}
