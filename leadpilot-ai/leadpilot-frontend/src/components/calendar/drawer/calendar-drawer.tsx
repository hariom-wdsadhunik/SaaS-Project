"use client";

import * as React from "react";
import { CalendarEventEntity } from "@/domain/calendar/types";
import { CalendarDrawerHeader } from "./calendar-drawer-header";
import { LeadTimeline } from "@/components/leads/drawer/lead-timeline";
import { LeadNotes } from "@/components/leads/drawer/lead-notes";

interface CalendarDrawerProps {
  event: CalendarEventEntity | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
}

type TabType = "overview" | "timeline" | "notes";

export function CalendarDrawer({ event, isOpen, onClose, onEdit }: CalendarDrawerProps) {
  const [activeTab, setActiveTab] = React.useState<TabType>("overview");

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !event) return null;

  const tabs: { id: TabType; label: string; count?: number }[] = [
    { id: "overview", label: "Overview" },
    { id: "timeline", label: "Activity History", count: 2 },
    { id: "notes", label: "Event Notes", count: 1 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-150 select-none">
      <div className="flex-1" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Calendar Event Workspace for ${event.title}`}
        className="w-full md:w-[42%] lg:w-[38%] xl:w-[32%] flex h-full flex-col border-l border-zinc-800 bg-zinc-950 shadow-2xl animate-in slide-in-from-right duration-200 overflow-hidden"
      >
        <CalendarDrawerHeader event={event} onClose={onClose} onEdit={onEdit} />

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 border-b border-zinc-800 overflow-x-auto pb-1 no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors shrink-0 ${
                  activeTab === tab.id
                    ? "border-b-2 border-indigo-500 text-indigo-400 bg-indigo-500/10"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="rounded-full bg-zinc-800 px-1.5 py-0.2 text-[10px] font-mono text-zinc-400">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-2">
            {activeTab === "overview" && (
              <div className="space-y-4 text-xs text-zinc-300">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-2">
                  <h4 className="font-bold text-white uppercase text-[10px] tracking-wider text-indigo-400">
                    Schedule Details
                  </h4>
                  <p className="text-zinc-400 leading-relaxed">
                    Type: <span className="text-zinc-200 font-semibold">{event.eventType.replace("_", " ")}</span> • Priority:{" "}
                    <span className="text-zinc-200 font-semibold">{event.priority}</span>. Host agent{" "}
                    <span className="text-zinc-200 font-semibold">{event.assignedAgentName}</span>.
                  </p>
                </div>
              </div>
            )}
            {activeTab === "timeline" && <LeadTimeline />}
            {activeTab === "notes" && <LeadNotes />}
          </div>
        </div>
      </div>
    </div>
  );
}
