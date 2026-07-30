import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRelativeTime } from "@/utils/formatters";

export interface ActivityItem {
  id: string;
  userName: string;
  userAvatar?: string;
  action: string;
  targetName: string;
  timestamp: string;
  badgeText: string;
  badgeVariant: "default" | "success" | "warning" | "ai" | "secondary";
}

const mockActivities: ActivityItem[] = [
  {
    id: "act-1",
    userName: "Alex Morgan",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    action: "Converted lead to active deal stage",
    targetName: "John Doe ($1.2M Villa)",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    badgeText: "Deal Created",
    badgeVariant: "success",
  },
  {
    id: "act-2",
    userName: "LeadPilot AI",
    action: "Auto-generated WhatsApp drip response for",
    targetName: "Sarah Jenkins",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    badgeText: "AI WhatsApp",
    badgeVariant: "ai",
  },
  {
    id: "act-3",
    userName: "Michael Chen",
    action: "Scheduled site viewing appointment for",
    targetName: "Downtown Penthouse #12B",
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    badgeText: "Viewing Scheduled",
    badgeVariant: "default",
  },
  {
    id: "act-4",
    userName: "Emily Watson",
    action: "Uploaded e-signature contract for",
    targetName: "Deal Marina Bay",
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    badgeText: "Document Signed",
    badgeVariant: "warning",
  },
];

export function RecentActivityTimeline({ isLoading = false }: { isLoading?: boolean }) {
  if (isLoading) {
    return (
      <Card className="border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
        <Skeleton className="h-6 w-36" />
        <div className="space-y-3">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-zinc-800/80 bg-zinc-900/80 p-6 shadow-sm">
      <CardHeader className="p-0 pb-4">
        <CardTitle className="text-base font-semibold text-white">Live Workspace Activity</CardTitle>
        <CardDescription className="text-xs text-zinc-400">
          Real-time audit log of team actions, AI automations, and deal updates
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0 space-y-3">
        {mockActivities.map((act) => (
          <div
            key={act.id}
            className="flex items-start justify-between rounded-xl border border-zinc-800/60 bg-zinc-950/40 p-3 hover:bg-zinc-900/60 transition-colors gap-3"
          >
            <div className="flex items-start gap-3">
              <Avatar src={act.userAvatar} fallback={act.userName[0]} size="sm" className="mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-xs text-zinc-200">
                  <span className="font-semibold text-white">{act.userName}</span> {act.action}{" "}
                  <span className="font-medium text-indigo-400">{act.targetName}</span>
                </p>
                <p className="text-[10px] text-zinc-500 font-mono">
                  {formatRelativeTime(act.timestamp)}
                </p>
              </div>
            </div>

            <Badge variant={act.badgeVariant} className="shrink-0 text-[10px] px-2 py-0.5">
              {act.badgeText}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
