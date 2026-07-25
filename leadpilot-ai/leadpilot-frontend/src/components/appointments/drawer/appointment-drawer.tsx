import * as React from "react";
import { AppointmentEntity } from "@/domain/appointment/types";
import { AppointmentDrawerHeader } from "./appointment-drawer-header";
import { User, Home, Clock, FileText, History } from "lucide-react";
import { formatDate } from "@/utils/formatters";

interface AppointmentDrawerProps {
  appointment: AppointmentEntity | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
}

export function AppointmentDrawer({
  appointment,
  isOpen,
  onClose,
  onEdit,
}: AppointmentDrawerProps) {
  const [activeTab, setActiveTab] = React.useState<"overview" | "customer" | "property" | "history">("overview");

  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md lg:max-w-lg xl:max-w-[40%] bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col">
          {/* Header */}
          <AppointmentDrawerHeader appointment={appointment} onClose={onClose} onEdit={onEdit} />

          {/* Navigation Tabs */}
          <div className="flex border-b border-zinc-800 bg-zinc-900/40 px-6 font-mono text-xs">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-3 px-3 border-b-2 font-medium transition-colors ${
                activeTab === "overview"
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("customer")}
              className={`py-3 px-3 border-b-2 font-medium transition-colors ${
                activeTab === "customer"
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Customer
            </button>
            <button
              onClick={() => setActiveTab("property")}
              className={`py-3 px-3 border-b-2 font-medium transition-colors ${
                activeTab === "property"
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Property
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`py-3 px-3 border-b-2 font-medium transition-colors ${
                activeTab === "history"
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              History
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-zinc-300">
            {activeTab === "overview" && (
              <div className="space-y-4">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                    <FileText className="h-4 w-4 text-indigo-400" />
                    <span>Appointment Synopsis</span>
                  </h4>
                  <p className="text-zinc-300 leading-relaxed">
                    {appointment.description || "No specific briefing recorded for this appointment slot."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3.5 space-y-1">
                    <span className="text-[10px] text-zinc-400 font-mono uppercase">Start Schedule</span>
                    <p className="text-xs font-bold text-white font-mono">{formatDate(appointment.start)}</p>
                  </div>
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3.5 space-y-1">
                    <span className="text-[10px] text-zinc-400 font-mono uppercase">End Schedule</span>
                    <p className="text-xs font-bold text-white font-mono">{formatDate(appointment.end)}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "customer" && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{appointment.customerName}</h4>
                    <p className="text-xs text-zinc-400 font-mono">Linked VIP Buyer Profile</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "property" && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                    <Home className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{appointment.propertyName}</h4>
                    <p className="text-xs text-zinc-400 font-mono">Real Estate Inventory Item</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "history" && (
              <div className="space-y-3 font-mono text-[11px]">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
                  <Clock className="h-4 w-4 text-indigo-400 mt-0.5" />
                  <div>
                    <p className="text-zinc-200 font-semibold">Appointment Scheduled</p>
                    <p className="text-zinc-500 text-[10px]">{formatDate(appointment.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
                  <History className="h-4 w-4 text-emerald-400 mt-0.5" />
                  <div>
                    <p className="text-zinc-200 font-semibold">Status set to {appointment.status}</p>
                    <p className="text-zinc-500 text-[10px]">{formatDate(appointment.updatedAt)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
