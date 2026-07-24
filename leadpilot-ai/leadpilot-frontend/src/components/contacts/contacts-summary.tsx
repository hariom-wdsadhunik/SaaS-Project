import * as React from "react";
import { Users, UserCheck, Sparkles, Star, ShieldCheck, Clock } from "lucide-react";
import { ContactEntity } from "@/domain/contact/types";

interface ContactsSummaryProps {
  contacts: ContactEntity[];
}

export function ContactsSummary({ contacts }: ContactsSummaryProps) {
  const totalCount = contacts.length;
  const activeCount = contacts.filter((c) => c.status === "ACTIVE").length;
  const prospectCount = contacts.filter((c) => c.status === "PROSPECT").length;
  const clientCount = contacts.filter((c) => c.status === "CLIENT").length;
  const vipCount = contacts.filter((c) => c.status === "VIP").length;

  const cards = [
    {
      title: "Total Contacts",
      value: totalCount.toString(),
      subtext: "Entire database",
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Active Contacts",
      value: activeCount.toString(),
      subtext: "Engaged records",
      icon: UserCheck,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      title: "Prospects",
      value: prospectCount.toString(),
      subtext: "Pipeline buyers",
      icon: Sparkles,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
    {
      title: "Clients",
      value: clientCount.toString(),
      subtext: "Closed accounts",
      icon: ShieldCheck,
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/20",
    },
    {
      title: "VIP Contacts",
      value: vipCount.toString(),
      subtext: "High net worth",
      icon: Star,
      color: "text-violet-400",
      bgColor: "bg-violet-500/10",
      borderColor: "border-violet-500/20",
    },
    {
      title: "Recently Added",
      value: "3",
      subtext: "Past 7 days",
      icon: Clock,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
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
