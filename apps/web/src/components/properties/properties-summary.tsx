import * as React from "react";
import { Building, CheckCircle2, Clock, DollarSign, Tag, TrendingUp } from "lucide-react";
import { PropertyEntity } from "@/domain/property/types";
import { formatCurrency } from "@/utils/formatters";

interface PropertiesSummaryProps {
  properties: PropertyEntity[];
}

export function PropertiesSummary({ properties }: PropertiesSummaryProps) {
  const totalCount = properties.length;
  const availableCount = properties.filter((p) => p.status === "AVAILABLE").length;
  const reservedCount = properties.filter((p) => p.status === "RESERVED").length;
  const soldCount = properties.filter((p) => p.status === "SOLD").length;

  const totalValue = properties.reduce((sum, p) => sum + p.price, 0);
  const avgPrice = totalCount > 0 ? Math.round(totalValue / totalCount) : 0;

  const cards = [
    {
      title: "Total Listings",
      value: totalCount.toString(),
      subtext: "Active portfolio size",
      icon: Building,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Available",
      value: availableCount.toString(),
      subtext: "Ready for offer",
      icon: CheckCircle2,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      title: "Reserved",
      value: reservedCount.toString(),
      subtext: "Pending closing",
      icon: Clock,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
    {
      title: "Sold / Closed",
      value: soldCount.toString(),
      subtext: "Completed sales",
      icon: Tag,
      color: "text-violet-400",
      bgColor: "bg-violet-500/10",
      borderColor: "border-violet-500/20",
    },
    {
      title: "Inventory Value",
      value: formatCurrency(totalValue),
      subtext: "Total gross value",
      icon: DollarSign,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      title: "Average Price",
      value: formatCurrency(avgPrice),
      subtext: "Mean listing value",
      icon: TrendingUp,
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="flex flex-col justify-between rounded-xl border border-zinc-800/80 bg-zinc-950 p-3.5 shadow-sm hover:border-zinc-700/80 transition-all select-none"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                {card.title}
              </span>
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-lg border ${card.bgColor} ${card.borderColor} ${card.color}`}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="mt-2">
              <div className="text-base font-extrabold font-mono text-white tracking-tight">
                {card.value}
              </div>
              <span className="text-[10px] text-zinc-500">{card.subtext}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
