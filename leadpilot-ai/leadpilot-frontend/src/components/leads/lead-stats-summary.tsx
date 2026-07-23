import * as React from "react";
import { Users, UserPlus, Sparkles, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

export function LeadStatsSummary() {
  const stats = [
    {
      label: "Total Database Leads",
      value: "248 Leads",
      subtext: "+14.2% vs last month",
      icon: Users,
      color: "text-indigo-400 border-indigo-500/20 bg-indigo-500/10",
    },
    {
      label: "New Leads (This Week)",
      value: "42 Leads",
      subtext: "12 unassigned",
      icon: UserPlus,
      color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
    },
    {
      label: "AI High Score Rate",
      value: "78.4%",
      subtext: "Score > 75 propensity",
      icon: Sparkles,
      color: "text-violet-400 border-violet-500/20 bg-violet-500/10",
    },
    {
      label: "Avg First Touch SLA",
      value: "4.2 mins",
      subtext: "Sub-10m WhatsApp target",
      icon: Clock,
      color: "text-cyan-400 border-cyan-500/20 bg-cyan-500/10",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.label}
            className="border-zinc-800/80 bg-zinc-900/80 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400">{stat.label}</span>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${stat.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-2">
              <div className="text-xl font-bold tracking-tight text-white font-mono">{stat.value}</div>
              <p className="text-[11px] text-zinc-500 mt-0.5">{stat.subtext}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
