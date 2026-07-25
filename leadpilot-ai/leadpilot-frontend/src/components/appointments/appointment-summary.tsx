import * as React from "react";
import { Calendar, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { AppointmentEntity } from "@/domain/appointment/types";

interface AppointmentSummaryProps {
  appointments: AppointmentEntity[];
}

export function AppointmentSummary({ appointments }: AppointmentSummaryProps) {
  const totalCount = appointments.length;
  const confirmedCount = appointments.filter((a) => a.status === "CONFIRMED").length;
  const viewingsCount = appointments.filter((a) => a.appointmentType === "PROPERTY_VIEWING").length;
  const urgentCount = appointments.filter((a) => a.priority === "URGENT").length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950 p-4 space-y-1">
        <div className="flex items-center justify-between text-zinc-400 text-xs">
          <span>Total Appointments</span>
          <Calendar className="h-4 w-4 text-indigo-400" />
        </div>
        <div className="text-2xl font-bold text-white font-mono">{totalCount}</div>
      </div>

      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950 p-4 space-y-1">
        <div className="flex items-center justify-between text-zinc-400 text-xs">
          <span>Confirmed Bookings</span>
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="text-2xl font-bold text-white font-mono">{confirmedCount}</div>
      </div>

      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950 p-4 space-y-1">
        <div className="flex items-center justify-between text-zinc-400 text-xs">
          <span>Property Viewings</span>
          <Clock className="h-4 w-4 text-cyan-400" />
        </div>
        <div className="text-2xl font-bold text-white font-mono">{viewingsCount}</div>
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
