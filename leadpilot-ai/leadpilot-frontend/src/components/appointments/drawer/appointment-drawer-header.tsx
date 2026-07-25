import * as React from "react";
import { X, Clock, Edit3, Link as LinkIcon, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AppointmentEntity } from "@/domain/appointment/types";
import { EntityStatusBadge } from "@/platform/ui/entity-status-badge";
import { formatDate } from "@/utils/formatters";
import { toast } from "sonner";

interface AppointmentDrawerHeaderProps {
  appointment: AppointmentEntity;
  onClose: () => void;
  onEdit?: () => void;
}

export function AppointmentDrawerHeader({
  appointment,
  onClose,
  onEdit,
}: AppointmentDrawerHeaderProps) {
  const priorityVariantMap = {
    URGENT: "danger",
    HIGH: "warning",
    MEDIUM: "secondary",
    LOW: "default",
  } as const;

  return (
    <div className="border-b border-zinc-800/80 bg-zinc-950 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md font-mono">
          {appointment.appointmentType.replace("_", " ")}
        </span>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-white">{appointment.title}</h2>
          <Badge variant={priorityVariantMap[appointment.priority]} className="text-[10px]">
            {appointment.priority}
          </Badge>
          <EntityStatusBadge status={appointment.status} />
        </div>
        {appointment.description && <p className="text-xs text-zinc-400">{appointment.description}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-b border-zinc-800/80 py-2.5 text-xs text-zinc-300 font-mono">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-indigo-400" />
          <span>{formatDate(appointment.start)}</span>
        </div>
        <div className="flex items-center gap-1.5 border-l border-zinc-800 pl-3">
          <LinkIcon className="h-3.5 w-3.5 text-cyan-400" />
          <span className="truncate">{appointment.propertyName}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 text-xs">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.success(`Appointment "${appointment.title}" checked in`)}
            className="h-8 text-xs gap-1.5"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>Check In</span>
          </Button>
          <Button size="sm" variant="outline" onClick={onEdit} className="h-8 text-xs gap-1.5">
            <Edit3 className="h-3.5 w-3.5 text-indigo-400" />
            <span>Edit Details</span>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Avatar src="" fallback={appointment.assignedAgentName[0]} size="sm" />
          <span className="text-xs text-zinc-300 font-mono hidden sm:inline">
            {appointment.assignedAgentName}
          </span>
        </div>
      </div>
    </div>
  );
}
