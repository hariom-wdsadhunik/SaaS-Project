import * as React from "react";
import { AppointmentEntity } from "@/domain/appointment/types";
import { EntityStatusBadge } from "@/platform/ui/entity-status-badge";
import { formatDate } from "@/utils/formatters";

interface AppointmentTableProps {
  data: AppointmentEntity[];
  onSelectAppointment?: (apt: AppointmentEntity) => void;
}

export function AppointmentTable({ data, onSelectAppointment }: AppointmentTableProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-900/80 text-zinc-400 font-semibold uppercase tracking-wider border-b border-zinc-800 select-none">
            <tr>
              <th className="p-3.5 pl-5">Appointment Title</th>
              <th className="p-3.5">Location / Link</th>
              <th className="p-3.5">Type</th>
              <th className="p-3.5">Schedule</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 pr-5">Host Agent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
            {data.map((apt) => (
              <tr
                key={apt.id}
                onClick={() => onSelectAppointment?.(apt)}
                className="hover:bg-zinc-900/60 transition-colors cursor-pointer"
              >
                <td className="p-3.5 pl-5 font-bold text-white max-w-[220px] truncate">{apt.title}</td>
                <td className="p-3.5 text-zinc-400 max-w-[200px] truncate">{apt.location}</td>
                <td className="p-3.5 font-mono text-[10px] uppercase text-indigo-400">
                  {(apt.meetingType || "VIDEO").replace("_", " ")}
                </td>
                <td className="p-3.5 font-mono text-zinc-400">{formatDate(apt.startTime)}</td>
                <td className="p-3.5">
                  <EntityStatusBadge status={apt.status} />
                </td>
                <td className="p-3.5 pr-5 font-mono text-zinc-400">{apt.assignedTo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
