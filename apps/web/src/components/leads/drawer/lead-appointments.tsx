import * as React from "react";
import { Calendar as CalendarIcon, Clock, MapPin, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface LeadAppointmentItem {
  id: string;
  title: string;
  dateTime: string;
  location: string;
  brokerName: string;
  status: "CONFIRMED" | "PENDING" | "COMPLETED";
}

const mockAppointments: LeadAppointmentItem[] = [
  {
    id: "app-101",
    title: "Downtown Luxury Villa Site Visit",
    dateTime: "Saturday, Jul 26 • 02:00 PM",
    location: "Palm Boulevard Villa #04",
    brokerName: "Alex Morgan",
    status: "CONFIRMED",
  },
];

export function LeadAppointments() {
  if (mockAppointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 p-8 text-center">
        <CalendarIcon className="h-8 w-8 text-zinc-500 mb-2" />
        <p className="text-xs font-semibold text-zinc-300">No Scheduled Viewings</p>
        <p className="text-[11px] text-zinc-500">No upcoming property appointments for this lead.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {mockAppointments.map((app) => (
        <Card key={app.id} className="p-3.5 border-zinc-800 bg-zinc-900/80 space-y-2.5">
          <div className="flex items-start justify-between">
            <h4 className="text-xs font-semibold text-white">{app.title}</h4>
            <Badge
              variant={app.status === "CONFIRMED" ? "success" : "warning"}
              className="text-[10px] px-2 py-0.5"
            >
              {app.status}
            </Badge>
          </div>

          <div className="space-y-1 text-xs text-zinc-300">
            <div className="flex items-center gap-2 text-indigo-400 font-mono">
              <Clock className="h-3.5 w-3.5 text-zinc-400" />
              <span>{app.dateTime}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <MapPin className="h-3.5 w-3.5 text-zinc-500" />
              <span>{app.location}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <User className="h-3.5 w-3.5 text-zinc-500" />
              <span>Assigned Agent: {app.brokerName}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
