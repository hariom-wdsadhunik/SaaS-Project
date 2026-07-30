"use client";

import * as React from "react";
import { DealItem } from "@/services/deal-mock-service";
import { DealDrawerHeader } from "./deal-drawer-header";
import { LeadTimeline } from "@/components/leads/drawer/lead-timeline";
import { LeadNotes } from "@/components/leads/drawer/lead-notes";
import { LeadTasks } from "@/components/leads/drawer/lead-tasks";
import { LeadDocuments } from "@/components/leads/drawer/lead-documents";
import { LeadPropertyMatches } from "@/components/leads/drawer/lead-property-matches";

interface DealDrawerProps {
  deal: DealItem | null;
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "activity" | "notes" | "tasks" | "documents" | "matches";

export function DealDrawer({ deal, isOpen, onClose }: DealDrawerProps) {
  const [activeTab, setActiveTab] = React.useState<TabType>("activity");

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !deal) return null;

  const tabs: { id: TabType; label: string; count?: number }[] = [
    { id: "activity", label: "Activity Timeline", count: 5 },
    { id: "notes", label: "Notes", count: 2 },
    { id: "tasks", label: "Tasks", count: 2 },
    { id: "documents", label: "Documents", count: 2 },
    { id: "matches", label: "Properties", count: 2 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-150 select-none">
      <div className="flex-1" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Deal Details for ${deal.title}`}
        className="w-full md:w-[42%] lg:w-[38%] xl:w-[32%] flex h-full flex-col border-l border-zinc-800 bg-zinc-950 shadow-2xl animate-in slide-in-from-right duration-200 overflow-hidden"
      >
        <DealDrawerHeader deal={deal} onClose={onClose} />

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
            {activeTab === "activity" && <LeadTimeline />}
            {activeTab === "notes" && <LeadNotes />}
            {activeTab === "tasks" && <LeadTasks />}
            {activeTab === "documents" && <LeadDocuments />}
            {activeTab === "matches" && <LeadPropertyMatches />}
          </div>
        </div>
      </div>
    </div>
  );
}
