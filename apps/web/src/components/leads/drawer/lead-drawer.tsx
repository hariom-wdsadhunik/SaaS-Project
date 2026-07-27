"use client";

import * as React from "react";
import { LeadItem } from "../lead-feedback";
import { LeadDrawerHeader } from "./lead-drawer-header";
import { LeadAIInsights } from "./lead-ai-insights";
import { LeadTimeline } from "./lead-timeline";
import { LeadNotes } from "./lead-notes";
import { LeadTasks } from "./lead-tasks";
import { LeadAppointments } from "./lead-appointments";
import { LeadDocuments } from "./lead-documents";
import { LeadPropertyMatches } from "./lead-property-matches";

interface LeadDrawerProps {
  lead: LeadItem | null;
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "activity" | "notes" | "tasks" | "appointments" | "documents" | "matches";

export function LeadDrawer({ lead, isOpen, onClose }: LeadDrawerProps) {
  const [activeTab, setActiveTab] = React.useState<TabType>("activity");
  const drawerRef = React.useRef<HTMLDivElement>(null);

  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !lead) return null;

  const tabs: { id: TabType; label: string; count?: number }[] = [
    { id: "activity", label: "Activity", count: 5 },
    { id: "notes", label: "Notes", count: 2 },
    { id: "tasks", label: "Tasks", count: 2 },
    { id: "appointments", label: "Viewings", count: 1 },
    { id: "documents", label: "Docs", count: 2 },
    { id: "matches", label: "AI Matches", count: 2 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-150 select-none">
      {/* Backdrop click to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Slide-over Drawer Panel (40% desktop, 100% mobile) */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Lead Details for ${lead.fullName}`}
        className="w-full md:w-[42%] lg:w-[38%] xl:w-[32%] flex h-full flex-col border-l border-zinc-800 bg-zinc-950 shadow-2xl animate-in slide-in-from-right duration-200 overflow-hidden"
      >
        {/* Fixed Header */}
        <LeadDrawerHeader lead={lead} onClose={onClose} />

        {/* Scrollable Workspace Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* AI Copilot Insights Panel */}
          <LeadAIInsights leadName={lead.fullName} score={lead.aiPropensityScore} />

          {/* Navigation Tab Bar */}
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

          {/* Tab Content Display */}
          <div className="pt-2">
            {activeTab === "activity" && <LeadTimeline />}
            {activeTab === "notes" && <LeadNotes />}
            {activeTab === "tasks" && <LeadTasks />}
            {activeTab === "appointments" && <LeadAppointments />}
            {activeTab === "documents" && <LeadDocuments />}
            {activeTab === "matches" && <LeadPropertyMatches />}
          </div>
        </div>
      </div>
    </div>
  );
}
