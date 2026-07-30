"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UsageLimitEngine } from "@/platform/billing/UsageLimitEngine";

export default function BillingDashboardPage() {
  const [selectedPlan, setSelectedPlan] = useState("professional");
  const engine = new UsageLimitEngine();

  const userUsage = engine.checkLimit(selectedPlan, "users", 12);
  const leadUsage = engine.checkLimit(selectedPlan, "leads", 3450);
  const aiUsage = engine.checkLimit(selectedPlan, "ai_requests", 1280);

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center border-b border-zinc-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Billing & Subscriptions</h1>
            <p className="text-xs text-zinc-400">Manage plan tier, seat allocation, usage metrics, and invoices.</p>
          </div>
          <Badge variant="blue">Active Plan: Professional</Badge>
        </div>

        {/* Current Plan Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Current Plan</h3>
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-black text-white capitalize">{selectedPlan}</span>
              <span className="text-sm font-bold text-zinc-300">$149/mo</span>
            </div>
            <p className="text-xs text-zinc-400">Renews on August 26, 2026. Billed monthly.</p>
            <Button variant="outline" size="sm" className="w-full text-xs">
              Manage Payment Methods
            </Button>
          </Card>

          <Card className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Seat Utilization</h3>
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-black text-white">{userUsage.currentCount} / {userUsage.maxLimit}</span>
              <span className="text-xs text-emerald-400">{userUsage.percentageUsed}% Used</span>
            </div>
            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: `${userUsage.percentageUsed}%` }}></div>
            </div>
            <p className="text-xs text-zinc-500">13 seats remaining on Professional tier.</p>
          </Card>

          <Card className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">AI Request Quota</h3>
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-black text-white">{aiUsage.currentCount} / {aiUsage.maxLimit}</span>
              <span className="text-xs text-blue-400">{aiUsage.percentageUsed}% Used</span>
            </div>
            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div className="bg-purple-600 h-full rounded-full" style={{ width: `${aiUsage.percentageUsed}%` }}></div>
            </div>
            <p className="text-xs text-zinc-500">Resets in 30 days.</p>
          </Card>
        </div>

        {/* Metered Usage Breakdown */}
        <Card className="space-y-4">
          <h3 className="text-base font-bold text-white">Metered Resource Consumption</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
              <span className="text-zinc-400">Leads Indexed</span>
              <p className="text-lg font-bold text-white">{leadUsage.currentCount} / {leadUsage.maxLimit}</p>
            </div>
            <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
              <span className="text-zinc-400">Deals Active</span>
              <p className="text-lg font-bold text-white">142 / 2,500</p>
            </div>
            <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
              <span className="text-zinc-400">Document Storage</span>
              <p className="text-lg font-bold text-white">14.2 GB / 100 GB</p>
            </div>
            <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
              <span className="text-zinc-400">Workflow Runs</span>
              <p className="text-lg font-bold text-white">2,140 / 10,000</p>
            </div>
          </div>
        </Card>

        {/* Plan Upgrade Options */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white">Available Upgrade Tiers</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["starter", "professional", "enterprise"].map((tier) => (
              <Card key={tier} className={`space-y-4 ${selectedPlan === tier ? "border-blue-500 bg-zinc-900/90" : ""}`}>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white capitalize">{tier}</span>
                  {selectedPlan === tier && <Badge variant="blue">Active</Badge>}
                </div>
                <Button
                  variant={selectedPlan === tier ? "secondary" : "primary"}
                  size="sm"
                  className="w-full"
                  onClick={() => setSelectedPlan(tier)}
                >
                  {selectedPlan === tier ? "Current Tier" : `Switch to ${tier}`}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
