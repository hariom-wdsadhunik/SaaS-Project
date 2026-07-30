import * as React from "react";
import { Calendar, CheckCircle2, Video, Clock } from "lucide-react";
import { AppointmentEntity } from "@/domain/appointment/types";

interface AppointmentSummaryProps {
  appointments: AppointmentEntity[];
}

export function AppointmentSummary({ appointments }: AppointmentSummaryProps) {
  const totalCount = appointments.length;
  const confirmedCount = appointments.filter((a) => a.status === "CONFIRMED").length;
  const siteVisitsCount = appointments.filter((a) => a.meetingType === "SITE_VISIT" || a.meetingType === "IN_PERSON").length;
  const videoCallsCount = appointments.filter((a) => a.meetingType === "VIDEO" || a.meetingType === "CALL").length;

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
          <span>Site Inspections &amp; Walkthroughs</span>
          <Clock className="h-4 w-4 text-amber-400" />
        </div>
        <div className="text-2xl font-bold text-white font-mono">{siteVisitsCount}</div>
      </div>

      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950 p-4 space-y-1">
        <div className="flex items-center justify-between text-zinc-400 text-xs">
          <span>Video &amp; Phone Meetings</span>
          <Video className="h-4 w-4 text-cyan-400" />
        </div>
        <div className="text-2xl font-bold text-cyan-400 font-mono">{videoCallsCount}</div>
      </div>
    </div>
  );
}
