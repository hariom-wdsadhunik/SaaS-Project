"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, ArrowLeft, UserPlus } from "lucide-react";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const handleInviteUser = () => {
    toast.info("Dispatched global administrator invitation");
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
              <Shield className="w-6 h-6 text-purple-400" />
              Global User &amp; Role Administration Console
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Cross-organization user lookup, global admin role assignments, and authentication session revocation
            </p>
          </div>
        </div>

        <Button variant="primary" size="sm" onClick={handleInviteUser}>
          <UserPlus className="w-4 h-4 mr-2" /> Global Admin Invite
        </Button>
      </div>

      <Card className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4">
        <h2 className="text-base font-semibold text-white">Global User Directory (1,280 Platform Users)</h2>

        <div className="divide-y divide-zinc-800/80">
          <div className="py-3.5 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-white">Alex Mercer</p>
                <Badge variant="ai">Global Super Admin</Badge>
              </div>
              <p className="text-xs text-zinc-400">alex@leadpilot.ai • Org: LeadPilot HQ</p>
            </div>
            <Badge variant="emerald">Verified Session</Badge>
          </div>

          <div className="py-3.5 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-white">Sarah Jenkins</p>
                <Badge variant="blue">Organization Owner</Badge>
              </div>
              <p className="text-xs text-zinc-400">sarah@apexrealty.com • Org: Apex Global Realty</p>
            </div>
            <Badge variant="emerald">Verified Session</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}
