"use client";

import * as React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const leadSourceData = [
  { name: "WhatsApp Business API", value: 42, color: "#6366f1" },
  { name: "Meta / IG Lead Ads", value: 28, color: "#8b5cf6" },
  { name: "Website Webhook", value: 16, color: "#10b981" },
  { name: "Client Referrals", value: 10, color: "#f59e0b" },
  { name: "Direct Organic", value: 4, color: "#06b6d4" },
];

export function LeadSourcesChart({ isLoading = false }: { isLoading?: boolean }) {
  if (isLoading) {
    return (
      <Card className="border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-[240px] w-full rounded-xl" />
      </Card>
    );
  }

  return (
    <Card className="border-zinc-800/80 bg-zinc-900/80 p-6 shadow-sm">
      <CardHeader className="p-0 pb-4">
        <CardTitle className="text-base font-semibold text-white">Lead Acquisition Channels</CardTitle>
        <CardDescription className="text-xs text-zinc-400">
          Source distribution of incoming buyer & seller inquiries
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Donut Chart */}
        <div className="h-[200px] w-full md:w-1/2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={leadSourceData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {leadSourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#09090b" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0];
                    return (
                      <div className="rounded-lg border border-zinc-800 bg-zinc-900/95 p-2.5 shadow-xl text-xs backdrop-blur-md">
                        <span className="font-semibold text-zinc-200">{data.name}: </span>
                        <span className="font-mono text-indigo-400 font-bold">{data.value}%</span>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend Channel Breakdown */}
        <div className="w-full md:w-1/2 space-y-2.5">
          {leadSourceData.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-zinc-300 truncate max-w-[140px]">{item.name}</span>
              </div>
              <span className="font-mono font-semibold text-zinc-100">{item.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
