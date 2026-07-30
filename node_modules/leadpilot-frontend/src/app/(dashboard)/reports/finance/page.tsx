"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, DollarSign, Download } from "lucide-react";
import { toast } from "sonner";

export default function FinanceReportsPage() {
  const handleExport = () => {
    toast.success("Exported Financial Ledger report to CSV");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-zinc-800/80 pb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/reports">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Hub
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-emerald-400" />
              Financial Analytics &amp; Revenue Ledger
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Subscription revenue metrics, monthly recurring revenue, ARPU, and billing schedules
            </p>
          </div>
        </div>

        <Button variant="primary" size="sm" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </Button>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-zinc-900/80 border border-zinc-800 space-y-1">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Monthly Recurring (MRR)</p>
          <p className="text-2xl font-bold text-white">$299K</p>
          <p className="text-[11px] text-emerald-400">+12.8% MoM Growth</p>
        </Card>
        <Card className="p-4 bg-zinc-900/80 border border-zinc-800 space-y-1">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Annual Run-Rate (ARR)</p>
          <p className="text-2xl font-bold text-white">$3.58M</p>
          <p className="text-[11px] text-emerald-400">+12.8% YoY</p>
        </Card>
        <Card className="p-4 bg-zinc-900/80 border border-zinc-800 space-y-1">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Avg Revenue Per User</p>
          <p className="text-2xl font-bold text-white">$1,850</p>
          <p className="text-[11px] text-blue-400">+8.2% Expansion</p>
        </Card>
        <Card className="p-4 bg-zinc-900/80 border border-zinc-800 space-y-1">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Net Retention (NRR)</p>
          <p className="text-2xl font-bold text-emerald-400">114.5%</p>
          <p className="text-[11px] text-emerald-400">Low Churn Cohort</p>
        </Card>
      </div>

      {/* Financial Breakdown Table */}
      <Card className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4">
        <h2 className="text-base font-semibold text-white">Subscription Revenue by Plan Tier</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3">Plan Tier</th>
                <th className="py-2.5 px-3">Active Accounts</th>
                <th className="py-2.5 px-3">Monthly Contribution</th>
                <th className="py-2.5 px-3">Growth Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              <tr className="hover:bg-zinc-800/40">
                <td className="py-3 px-3 font-semibold text-white">Enterprise Pro ($299/mo)</td>
                <td className="py-3 px-3 text-zinc-300">820 Accounts</td>
                <td className="py-3 px-3 font-semibold text-emerald-400">$245,180 / mo</td>
                <td className="py-3 px-3 text-emerald-400">+14.2%</td>
              </tr>
              <tr className="hover:bg-zinc-800/40">
                <td className="py-3 px-3 font-semibold text-white">Growth Tier ($149/mo)</td>
                <td className="py-3 px-3 text-zinc-300">360 Accounts</td>
                <td className="py-3 px-3 font-semibold text-emerald-400">$53,640 / mo</td>
                <td className="py-3 px-3 text-emerald-400">+9.8%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
