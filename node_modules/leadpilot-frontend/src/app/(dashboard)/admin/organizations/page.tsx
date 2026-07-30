"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, ArrowLeft, Plus } from "lucide-react";
import { toast } from "sonner";

export default function AdminOrganizationsPage() {
  const handleProvisionTenant = () => {
    toast.info("Provisioned new enterprise workspace tenant");
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
              <Users className="w-6 h-6 text-blue-400" />
              Organization &amp; Multi-Tenant License Management
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Tenant workspace provisioning, seat allocations, domain isolation, and subscription tier overrides
            </p>
          </div>
        </div>

        <Button variant="primary" size="sm" onClick={handleProvisionTenant}>
          <Plus className="w-4 h-4 mr-2" /> Provision Tenant
        </Button>
      </div>

      <Card className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4">
        <h2 className="text-base font-semibold text-white">Active Tenant Workspaces (142 Workspaces)</h2>

        <div className="divide-y divide-zinc-800/80">
          <div className="py-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-white">Apex Global Realty</p>
                <Badge variant="emerald">Enterprise Tier</Badge>
              </div>
              <p className="text-xs text-zinc-400">Slug: <span className="font-mono text-zinc-300">apex-global</span> • Seats: 45 / 50 Allocated</p>
            </div>
            <Badge variant="blue">Active</Badge>
          </div>

          <div className="py-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-white">Vanguard Partners</p>
                <Badge variant="amber">Growth Tier</Badge>
              </div>
              <p className="text-xs text-zinc-400">Slug: <span className="font-mono text-zinc-300">vanguard-partners</span> • Seats: 12 / 15 Allocated</p>
            </div>
            <Badge variant="blue">Active</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}
