"use client";

import * as React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/formatters";

interface RevenueDataPoint {
  date: string;
  revenue: number;
  dealsCount: number;
}

const mockRevenueData: Record<string, RevenueDataPoint[]> = {
  "30D": [
    { date: "Jul 01", revenue: 45000, dealsCount: 3 },
    { date: "Jul 05", revenue: 62000, dealsCount: 4 },
    { date: "Jul 10", revenue: 89000, dealsCount: 6 },
    { date: "Jul 15", revenue: 112000, dealsCount: 7 },
    { date: "Jul 20", revenue: 145000, dealsCount: 9 },
    { date: "Jul 24", revenue: 185000, dealsCount: 12 },
  ],
  "7D": [
    { date: "Mon", revenue: 20000, dealsCount: 1 },
    { date: "Tue", revenue: 35000, dealsCount: 2 },
    { date: "Wed", revenue: 48000, dealsCount: 3 },
    { date: "Thu", revenue: 65000, dealsCount: 4 },
    { date: "Fri", revenue: 82000, dealsCount: 5 },
    { date: "Sat", revenue: 95000, dealsCount: 6 },
    { date: "Sun", revenue: 110000, dealsCount: 7 },
  ],
  "90D": [
    { date: "May", revenue: 220000, dealsCount: 15 },
    { date: "Jun", revenue: 380000, dealsCount: 24 },
    { date: "Jul", revenue: 540000, dealsCount: 36 },
  ],
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: RevenueDataPoint }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/95 p-3 shadow-xl backdrop-blur-md text-xs">
        <p className="font-semibold text-zinc-300">{label}</p>
        <p className="text-sm font-bold text-indigo-400 mt-1 font-mono">
          {formatCurrency(data.revenue)}
        </p>
        <p className="text-[11px] text-zinc-400 mt-0.5">{data.dealsCount} Deals Closed</p>
      </div>
    );
  }
  return null;
}

export function RevenueChart({ isLoading = false }: { isLoading?: boolean }) {
  const [timeframe, setTimeframe] = React.useState<"7D" | "30D" | "90D">("30D");

  if (isLoading) {
    return (
      <Card className="border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-[280px] w-full rounded-xl" />
      </Card>
    );
  }

  const data = mockRevenueData[timeframe];

  return (
    <Card className="border-zinc-800/80 bg-zinc-900/80 p-6 shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-0 pb-6 gap-4">
        <div>
          <CardTitle className="text-base font-semibold text-white">
            Gross Commission Income & Velocity
          </CardTitle>
          <CardDescription className="text-xs text-zinc-400 mt-1">
            Real-time GCI earnings and closed real estate transaction volume
          </CardDescription>
        </div>

        {/* Timeframe Selector Tabs */}
        <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-950 p-1">
          {(["7D", "30D", "90D"] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                timeframe === tf
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#71717a"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#71717a"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#6366f1"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
