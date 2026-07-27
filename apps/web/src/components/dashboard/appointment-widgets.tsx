"use client";

import * as React from "react";
import { Calendar, Video, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabaseAppointmentRepository } from "@/infrastructure/repositories/SupabaseAppointmentRepository";
import { AppointmentEntity } from "@/domain/appointment/types";

export function AppointmentWidgets() {
  const [appointments, setAppointments] = React.useState<AppointmentEntity[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    supabaseAppointmentRepository
      .getAppointments()
      .then((data) => {
        setAppointments(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const now = new Date();

  const todayMeetings = appointments.filter((a) => {
    const d = new Date(a.startTime);
    return d.toDateString() === now.toDateString() && a.status !== "CANCELLED";
  });

  const upcomingMeetings = appointments.filter((a) => {
    const d = new Date(a.startTime);
    return d > now && a.status !== "CANCELLED" && a.status !== "COMPLETED";
  });

  const weekEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const thisWeekMeetings = appointments.filter((a) => {
    const d = new Date(a.startTime);
    return d >= now && d <= weekEnd && a.status !== "CANCELLED";
  });

  const noShowsCount = appointments.filter((a) => a.status === "NO_SHOW").length;
  const completedCount = appointments.filter((a) => a.status === "COMPLETED").length;

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-28 rounded-2xl border border-zinc-800 bg-zinc-950/60" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
          <Calendar className="h-4 w-4 text-violet-400" />
          <span>Calendar &amp; Appointment Operational Widgets</span>
        </h3>
        <Badge variant="outline" className="text-[10px] text-zinc-400">
          Live Sync Engine
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Today's Meetings */}
        <Card className="rounded-2xl border-zinc-800/80 bg-zinc-900/90 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Today&apos;s Meetings</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
              <Video className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white font-mono">{todayMeetings.length}</span>
            <span className="text-[10px] text-violet-400 font-mono">Today</span>
          </div>
        </Card>

        {/* Upcoming Meetings */}
        <Card className="rounded-2xl border-zinc-800/80 bg-zinc-900/90 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Upcoming Meetings</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <Clock className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white font-mono">{upcomingMeetings.length}</span>
            <span className="text-[10px] text-indigo-400 font-mono">Queued</span>
          </div>
        </Card>

        {/* This Week */}
        <Card className="rounded-2xl border-zinc-800/80 bg-zinc-900/90 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">This Week</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <Calendar className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white font-mono">{thisWeekMeetings.length}</span>
            <span className="text-[10px] text-amber-400 font-mono">7-Day Horizon</span>
          </div>
        </Card>

        {/* No Shows */}
        <Card className="rounded-2xl border-rose-500/20 bg-rose-500/5 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-300">No Shows</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400">
              <AlertCircle className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-rose-200 font-mono">{noShowsCount}</span>
            <span className="text-[10px] text-rose-400 font-mono">Follow-up Required</span>
          </div>
        </Card>

        {/* Completed Meetings */}
        <Card className="rounded-2xl border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-300">Completed</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-200 font-mono">{completedCount}</span>
            <span className="text-[10px] text-emerald-400 font-mono">Concluded</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
