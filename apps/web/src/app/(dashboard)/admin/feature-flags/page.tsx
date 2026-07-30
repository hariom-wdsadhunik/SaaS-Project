"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AdminService } from "@/domain/admin/AdminService";
import { FeatureFlagRecord } from "@/domain/admin/AdminTypes";
import { Flag, ArrowLeft, Plus, Save } from "lucide-react";
import { toast } from "sonner";

export default function AdminFeatureFlagsPage() {
  const [flags, setFlags] = React.useState<FeatureFlagRecord[]>(() =>
    AdminService.getFeatureFlags()
  );
  const [flagKey, setFlagKey] = React.useState("");
  const [flagName, setFlagName] = React.useState("");

  const handleCreateFlag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flagKey || !flagName) return;

    const item: FeatureFlagRecord = {
      id: `flag-${Date.now()}`,
      key: flagKey,
      name: flagName,
      description: "User defined environment feature flag",
      enabled: true,
      environment: "PRODUCTION",
      rolloutPercentage: 100,
      updatedAt: new Date().toISOString(),
    };

    setFlags((prev) => [item, ...prev]);
    setFlagKey("");
    setFlagName("");
    toast.success(`Created feature flag "${item.key}"`);
  };

  const handleToggleFlag = (id: string, current: boolean) => {
    setFlags((prev) =>
      prev.map((f) => (f.id === id ? { ...f, enabled: !current } : f))
    );
    toast.info(`Updated feature flag state`);
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
              <Flag className="w-6 h-6 text-amber-400" />
              Centralized Feature Flags &amp; Percentage Rollout Console
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Dynamic feature toggles, environment gates, percentage canary rollouts, and tenant target overrides
            </p>
          </div>
        </div>

        <Badge variant="amber">{flags.length} Feature Flags</Badge>
      </div>

      {/* Create Flag Card */}
      <Card className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-amber-400" /> Create Feature Flag
        </h2>

        <form onSubmit={handleCreateFlag} className="flex flex-col sm:flex-row items-end gap-4">
          <div className="flex-1 space-y-1.5 w-full">
            <label className="text-xs font-medium text-zinc-300">Flag Key</label>
            <Input
              value={flagKey}
              onChange={(e) => setFlagKey(e.target.value)}
              placeholder="e.g. ai_whatsapp_assistant_v2"
              required
            />
          </div>

          <div className="flex-1 space-y-1.5 w-full">
            <label className="text-xs font-medium text-zinc-300">Flag Display Name</label>
            <Input
              value={flagName}
              onChange={(e) => setFlagName(e.target.value)}
              placeholder="e.g. AI WhatsApp Assistant v2"
              required
            />
          </div>

          <Button type="submit" variant="primary">
            <Save className="w-4 h-4 mr-2" /> Save Flag
          </Button>
        </form>
      </Card>

      {/* Feature Flags List */}
      <div className="space-y-4">
        {flags.map((flag) => (
          <Card key={flag.id} className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={flag.enabled ? "emerald" : "rose"}>
                    {flag.enabled ? "ENABLED" : "DISABLED"}
                  </Badge>
                  <p className="text-base font-bold text-white">{flag.name}</p>
                  <span className="text-xs font-mono text-amber-400">({flag.key})</span>
                </div>
                <p className="text-xs text-zinc-400">{flag.description}</p>
                <p className="text-xs text-zinc-500 font-mono">
                  Env: {flag.environment} • Rollout: {flag.rolloutPercentage}%
                </p>
              </div>

              <Button
                variant={flag.enabled ? "outline" : "primary"}
                size="sm"
                onClick={() => handleToggleFlag(flag.id, flag.enabled)}
              >
                {flag.enabled ? "Disable Flag" : "Enable Flag"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
