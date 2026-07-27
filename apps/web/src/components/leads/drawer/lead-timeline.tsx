import * as React from "react";
import { MessageSquare, PhoneCall, Mail, Calendar, UserCheck, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/utils/formatters";

export interface TimelineEvent {
  id: string;
  type: "CALL" | "EMAIL" | "WHATSAPP" | "MEETING" | "STATUS_CHANGE" | "ASSIGNMENT" | "SYSTEM";
  title: string;
  description: string;
  timestamp: string;
  actorName: string;
}

const mockTimelineEvents: TimelineEvent[] = [
  {
    id: "evt-1",
    type: "WHATSAPP",
    title: "WhatsApp AI Sequence Triggered",
    description: "Auto-replied with Downtown villa catalogue PDF to buyer query.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    actorName: "LeadPilot AI",
  },
  {
    id: "evt-2",
    type: "STATUS_CHANGE",
    title: "Lead Status Updated to QUALIFIED",
    description: "Propensity score crossed 75/100 threshold.",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    actorName: "LeadPilot AI",
  },
  {
    id: "evt-3",
    type: "CALL",
    title: "Discovery Phone Call Completed",
    description: "Discussed 3-bedroom requirement, budget range $1.2M - $1.5M.",
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    actorName: "Alex Morgan",
  },
  {
    id: "evt-4",
    type: "MEETING",
    title: "Site Viewing Confirmed",
    description: "Confirmed Saturday viewing appointment at Palm Boulevard Villa.",
    timestamp: new Date(Date.now() - 1000 * 60 * 1440).toISOString(),
    actorName: "Sarah Jenkins",
  },
  {
    id: "evt-5",
    type: "ASSIGNMENT",
    title: "Assigned Lead to Broker",
    description: "Re-assigned to Senior Agent Alex Morgan.",
    timestamp: new Date(Date.now() - 1000 * 60 * 2880).toISOString(),
    actorName: "System Admin",
  },
];

export function LeadTimeline() {
  const getIcon = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "WHATSAPP":
        return <MessageSquare className="h-3.5 w-3.5 text-indigo-400" />;
      case "CALL":
        return <PhoneCall className="h-3.5 w-3.5 text-emerald-400" />;
      case "EMAIL":
        return <Mail className="h-3.5 w-3.5 text-amber-400" />;
      case "MEETING":
        return <Calendar className="h-3.5 w-3.5 text-cyan-400" />;
      case "ASSIGNMENT":
        return <UserCheck className="h-3.5 w-3.5 text-violet-400" />;
      default:
        return <ShieldCheck className="h-3.5 w-3.5 text-zinc-400" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-white">Activity History</h4>
        <span className="text-[10px] text-zinc-500 font-mono">5 Recorded Events</span>
      </div>

      <div className="relative border-l border-zinc-800 ml-3 pl-5 space-y-6">
        {mockTimelineEvents.map((evt) => (
          <div key={evt.id} className="relative group">
            {/* Timeline Dot Icon */}
            <div className="absolute -left-[31px] top-0 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 shadow-sm">
              {getIcon(evt.type)}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-200">{evt.title}</span>
                <span className="text-[10px] font-mono text-zinc-500">
                  {formatRelativeTime(evt.timestamp)}
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">{evt.description}</p>
              <div className="pt-1 flex items-center gap-2">
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  By {evt.actorName}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
