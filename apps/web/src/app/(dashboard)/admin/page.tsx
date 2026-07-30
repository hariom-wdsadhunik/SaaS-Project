"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminService } from "@/domain/admin/AdminService";
import { Shield, Server, Users, Flag, Activity, ArrowUpRight } from "lucide-react";

export default function AdminOverviewPage() {
  const stats = AdminService.getOverviewStats();
  const metrics = AdminService.getSystemMetrics();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-zinc-800/80 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-rose-500" />
            Enterprise Platform Administration &amp; SOC Command Center
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Global multi-tenant governance, infrastructure monitoring, feature flags, and security operations
          </p>
        </div>

        <Badge variant="emerald" className="px-3 py-1 text-xs">
          System Status: 99.98% Uptime
        </Badge>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-zinc-900/80 border border-zinc-800 space-y-1">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Active Organizations</p>
          <p className="text-2xl font-bold text-white">{stats.activeOrganizations}</p>
          <p className="text-[11px] text-emerald-400">Multi-tenant isolated</p>
        </Card>
        <Card className="p-4 bg-zinc-900/80 border border-zinc-800 space-y-1">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total Platform Users</p>
          <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
          <p className="text-[11px] text-blue-400">Scoped RBAC roles</p>
        </Card>
        <Card className="p-4 bg-zinc-900/80 border border-zinc-800 space-y-1">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Active Feature Flags</p>
          <p className="text-2xl font-bold text-amber-400">{stats.activeFeatureFlagCount}</p>
          <p className="text-[11px] text-zinc-400">Dynamic rollouts</p>
        </Card>
        <Card className="p-4 bg-zinc-900/80 border border-zinc-800 space-y-1">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Security Alerts</p>
          <p className="text-2xl font-bold text-emerald-400">0 High Severity</p>
          <p className="text-[11px] text-emerald-400">SOC Clean</p>
        </Card>
      </div>

      {/* Navigation Sub-App Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/organizations">
          <Card className="p-5 bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-colors space-y-2 group">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white group-hover:text-blue-400 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-400" /> Organizations &amp; Licenses
              </span>
              <ArrowUpRight className="w-4 h-4 text-zinc-500" />
            </div>
            <p className="text-xs text-zinc-400">Manage tenant workspaces, seat allocations, and subscription plans</p>
          </Card>
        </Link>

        <Link href="/admin/feature-flags">
          <Card className="p-5 bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-colors space-y-2 group">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white group-hover:text-amber-400 flex items-center gap-1.5">
                <Flag className="w-4 h-4 text-amber-400" /> Feature Flags Studio
              </span>
              <ArrowUpRight className="w-4 h-4 text-zinc-500" />
            </div>
            <p className="text-xs text-zinc-400">Configure feature toggles, environment gates, and percentage rollouts</p>
          </Card>
        </Link>

        <Link href="/admin/monitoring">
          <Card className="p-5 bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-colors space-y-2 group">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white group-hover:text-emerald-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" /> Infrastructure Telemetry
              </span>
              <ArrowUpRight className="w-4 h-4 text-zinc-500" />
            </div>
            <p className="text-xs text-zinc-400">Monitor CPU, memory, API response latency, and database pools</p>
          </Card>
        </Link>
      </div>

      {/* System Telemetry Overview Matrix */}
      <Card className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <Server className="w-5 h-5 text-indigo-400" /> Live System Telemetry Matrix
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metrics.map((m, idx) => (
            <div key={idx} className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 space-y-1">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>{m.metric}</span>
                <Badge variant="emerald">{m.status}</Badge>
              </div>
              <p className="text-xl font-bold text-white pt-1">
                {m.value} <span className="text-xs font-normal text-zinc-400">{m.unit}</span>
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
