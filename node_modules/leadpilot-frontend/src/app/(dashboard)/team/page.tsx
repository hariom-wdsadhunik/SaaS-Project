"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, Trophy, Shield, Activity, UserPlus, FileText } from "lucide-react";

export default function TeamDashboardPage() {
  const members = [
    { id: "usr-1", name: "Alex Morgan", role: "Owner", dealsWon: 14, revenue: 14500000, conversion: "42%" },
    { id: "usr-2", name: "Sarah Jenkins", role: "Manager", dealsWon: 9, revenue: 8200000, conversion: "38%" },
    { id: "usr-3", name: "Marcus Vance", role: "Agent", dealsWon: 6, revenue: 5100000, conversion: "31%" },
    { id: "usr-4", name: "Elena Rostova", role: "Agent", dealsWon: 5, revenue: 4400000, conversion: "29%" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Sub-Navigation */}
      <div className="border-b border-zinc-800/80 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" />
            Enterprise Team &amp; Organization Management
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Multi-tenant workspace operations, team leaderboard, RBAC permissions, and audit logs
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/team/members">
            <Button variant="outline" size="sm">
              <UserCheck className="w-4 h-4 mr-2 text-emerald-400" /> Members
            </Button>
          </Link>
          <Link href="/team/invitations">
            <Button variant="outline" size="sm">
              <UserPlus className="w-4 h-4 mr-2 text-blue-400" /> Invitations
            </Button>
          </Link>
          <Link href="/team/activity">
            <Button variant="outline" size="sm">
              <Activity className="w-4 h-4 mr-2 text-amber-400" /> Activity
            </Button>
          </Link>
          <Link href="/team/roles">
            <Button variant="outline" size="sm">
              <Shield className="w-4 h-4 mr-2 text-indigo-400" /> RBAC Roles
            </Button>
          </Link>
          <Link href="/team/audit">
            <Button variant="outline" size="sm">
              <FileText className="w-4 h-4 mr-2 text-rose-400" /> Audit Log
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-zinc-900/80 border border-zinc-800 space-y-1">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Active Team Members</p>
          <p className="text-2xl font-bold text-white">12 Members</p>
          <p className="text-[11px] text-emerald-400">10 Online Now</p>
        </Card>
        <Card className="p-4 bg-zinc-900/80 border border-zinc-800 space-y-1">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total Closed Volume</p>
          <p className="text-2xl font-bold text-white">$32.2M</p>
          <p className="text-[11px] text-emerald-400">+18.4% vs last month</p>
        </Card>
        <Card className="p-4 bg-zinc-900/80 border border-zinc-800 space-y-1">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Avg Team Conversion</p>
          <p className="text-2xl font-bold text-white">35.2%</p>
          <p className="text-[11px] text-blue-400">+4.1% industry benchmark</p>
        </Card>
        <Card className="p-4 bg-zinc-900/80 border border-zinc-800 space-y-1">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Pending Invites</p>
          <p className="text-2xl font-bold text-amber-400">3 Pending</p>
          <p className="text-[11px] text-zinc-400">2 sent today</p>
        </Card>
      </div>

      {/* Team Leaderboard */}
      <Card className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" /> Sales Leaderboard &amp; Performance
          </h2>
          <Badge variant="emerald">Top Performers</Badge>
        </div>

        <div className="divide-y divide-zinc-800/80">
          {members.map((m, idx) => (
            <div key={m.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-white">
                  #{idx + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{m.name}</p>
                  <p className="text-xs text-zinc-400">{m.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs">
                <div>
                  <p className="text-zinc-500">Deals Won</p>
                  <p className="font-semibold text-white">{m.dealsWon}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Revenue</p>
                  <p className="font-semibold text-emerald-400">${(m.revenue / 1000000).toFixed(1)}M</p>
                </div>
                <div>
                  <p className="text-zinc-500">Conversion</p>
                  <p className="font-semibold text-blue-400">{m.conversion}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
