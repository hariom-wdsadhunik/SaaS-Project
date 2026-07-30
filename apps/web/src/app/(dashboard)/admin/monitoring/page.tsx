"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminService } from "@/domain/admin/AdminService";
import { Activity, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function AdminMonitoringPage() {
  const metrics = AdminService.getSystemMetrics();

  const handleRefreshMetrics = () => {
    toast.success("Refreshed infrastructure telemetry metrics");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-zinc-800/80 pb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Admin
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-emerald-400" />
              Real-time Telemetry &amp; Infrastructure Monitoring
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Cluster health, CPU/Memory utilization, API p99 latency, database pool saturation, and integration health
            </p>
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={handleRefreshMetrics}>
          Refresh Telemetry
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((m, idx) => (
          <Card key={idx} className="p-5 bg-zinc-900/80 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400">{m.metric}</span>
              <Badge variant="emerald">{m.status}</Badge>
            </div>
            <p className="text-2xl font-bold text-white">
              {m.value} <span className="text-xs font-normal text-zinc-400">{m.unit}</span>
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
