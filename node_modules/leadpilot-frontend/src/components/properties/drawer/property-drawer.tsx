"use client";

import * as React from "react";
import Image from "next/image";
import { PropertyEntity } from "@/domain/property/types";
import { PropertyDrawerHeader } from "./property-drawer-header";
import { LeadTimeline } from "@/components/leads/drawer/lead-timeline";
import { LeadNotes } from "@/components/leads/drawer/lead-notes";
import { LeadDocuments } from "@/components/leads/drawer/lead-documents";

interface PropertyDrawerProps {
  property: PropertyEntity | null;
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "overview" | "gallery" | "documents" | "notes" | "timeline";

export function PropertyDrawer({ property, isOpen, onClose }: PropertyDrawerProps) {
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

  if (!isOpen || !property) return null;

  const tabs: { id: TabType; label: string; count?: number }[] = [
    { id: "overview", label: "Overview" },
    { id: "gallery", label: "Media Gallery", count: 4 },
    { id: "documents", label: "Documents", count: 2 },
    { id: "notes", label: "Notes", count: 1 },
    { id: "timeline", label: "Timeline", count: 3 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-150 select-none">
      <div className="flex-1" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Property Details for ${property.title}`}
        className="w-full md:w-[42%] lg:w-[38%] xl:w-[32%] flex h-full flex-col border-l border-zinc-800 bg-zinc-950 shadow-2xl animate-in slide-in-from-right duration-200 overflow-hidden"
      >
        <PropertyDrawerHeader property={property} onClose={onClose} />

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
                <div className="relative h-56 w-full rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
                  <Image
                    src={property.coverImageUrl}
                    alt={property.title}
                    fill
                    sizes="600px"
                    className="object-cover"
                  />
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-2">
                  <h4 className="font-bold text-white uppercase text-[10px] tracking-wider text-indigo-400">
                    Property Features &amp; Overview
                  </h4>
                  <p className="text-zinc-400 leading-relaxed">
                    High-end architectural luxury listing located at {property.address}, {property.city}. Year built: {property.yearBuilt}. Features high ceiling heights, premium fixtures, and high ROI investment potential.
                  </p>
                </div>
              </div>
            )}
            {activeTab === "gallery" && (
              <div className="grid grid-cols-2 gap-3">
                {[property.coverImageUrl, property.coverImageUrl, property.coverImageUrl, property.coverImageUrl].map((url, idx) => (
                  <div key={idx} className="relative h-32 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
                    <Image src={url} alt={`Gallery image ${idx + 1}`} fill sizes="300px" className="object-cover" />
                  </div>
                ))}
              </div>
            )}
            {activeTab === "documents" && <LeadDocuments />}
            {activeTab === "notes" && <LeadNotes />}
            {activeTab === "timeline" && <LeadTimeline />}
          </div>
        </div>
      </div>
    </div>
  );
}
