import * as React from "react";
import { CalendarEventEntity, CalendarViewMode } from "@/domain/calendar/types";
import { CalendarEventCard } from "./calendar-event-card";

interface CalendarGridProps {
  events: CalendarEventEntity[];
  viewMode: CalendarViewMode;
  onSelectEvent?: (evt: CalendarEventEntity) => void;
}

export function CalendarGrid({ events, viewMode, onSelectEvent }: CalendarGridProps) {
  if (viewMode === "agenda" || events.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((evt) => (
          <CalendarEventCard key={evt.id} event={evt} onSelect={onSelectEvent} />
        ))}
      </div>
    );
  }

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden space-y-px bg-zinc-800">
      {/* Days Header */}
      <div className="grid grid-cols-7 bg-zinc-900 text-center py-2.5 text-xs font-bold text-zinc-400 uppercase tracking-wider">
        {daysOfWeek.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Grid Cells */}
      <div className="grid grid-cols-7 gap-px bg-zinc-800">
        {Array.from({ length: 28 }).map((_, idx) => {
          const dayNum = idx + 1;
          const dayEvents = events.filter((e) => new Date(e.start).getDate() === dayNum % 31);
          return (
            <div
              key={idx}
              className="bg-zinc-950 min-h-[110px] p-2 hover:bg-zinc-900/50 transition-colors flex flex-col justify-between"
            >
              <div className="text-xs font-mono text-zinc-400 font-bold">{dayNum}</div>
              <div className="space-y-1">
                {dayEvents.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => onSelectEvent?.(evt)}
                    className="text-[10px] truncate px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 cursor-pointer hover:bg-indigo-500/30"
                  >
                    {evt.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
