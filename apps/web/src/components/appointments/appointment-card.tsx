import * as React from "react";
import { AppointmentEntity } from "@/domain/appointment/types";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { EntityStatusBadge } from "@/platform/ui/entity-status-badge";
import { formatDate } from "@/utils/formatters";

interface AppointmentCardProps {
  appointment: AppointmentEntity;
  onSelectAppointment?: (apt: AppointmentEntity) => void;
}

export function AppointmentCard({ appointment, onSelectAppointment }: AppointmentCardProps) {
  return (
    <div
      onClick={() => onSelectAppointment?.(appointment)}
      className="group relative rounded-xl border border-zinc-800 bg-zinc-950 p-5 hover:border-indigo-500/50 hover:shadow-xl transition-all duration-200 cursor-pointer space-y-4 select-none"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
          {(appointment.meetingType || "VIDEO").replace("_", " ")}
        </span>
        <EntityStatusBadge status={appointment.status} />
      </div>

      <div>
        <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
          {appointment.title}
        </h3>
        <p className="text-xs text-zinc-400 line-clamp-2 mt-1">{appointment.description}</p>
      </div>

      <div className="space-y-1.5 text-xs text-zinc-300 border-t border-zinc-800/80 pt-3">
        <div className="flex items-center gap-2">
          <User className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
          <span className="font-semibold text-white truncate">{appointment.assignedTo}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
          <span className="text-zinc-400 truncate">{appointment.location}</span>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-zinc-800/80 pt-2 text-[11px] text-zinc-400 font-mono">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-indigo-400" />
          <span>{formatDate(appointment.startTime)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-zinc-500" />
          <span>{new Date(appointment.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </div>
  );
}
