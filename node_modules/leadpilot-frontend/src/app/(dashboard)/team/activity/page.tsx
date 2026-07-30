"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ActivityLogger } from "@/domain/organization/ActivityLogger";
import { ActivityEvent } from "@/domain/organization/OrganizationTypes";
import { Activity, ArrowLeft, Clock } from "lucide-react";

export default function TeamActivityPage() {
  const [activities, setActivities] = React.useState<ActivityEvent[]>([]);

  React.useEffect(() => {
    ActivityLogger.getActivities().then(setActivities);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-zinc-800/80 pb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/team">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Team
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-amber-400" />
              Organization Activity Feed
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Real-time chronological timeline of team actions across leads, deals, tasks, and settings
            </p>
          </div>
        </div>
      </div>

      {/* Activity Timeline List */}
      <Card className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4">
        <div className="divide-y divide-zinc-800/80">
          {activities.map((act) => (
            <div key={act.id} className="py-4 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {act.userName} <span className="font-normal text-zinc-400">— {act.action}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="blue">{act.objectType}</Badge>
                    <span className="text-xs font-mono text-zinc-500">{act.objectTitle}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs text-zinc-500 shrink-0">
                <Clock className="w-3.5 h-3.5" />
                <span>{new Date(act.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
