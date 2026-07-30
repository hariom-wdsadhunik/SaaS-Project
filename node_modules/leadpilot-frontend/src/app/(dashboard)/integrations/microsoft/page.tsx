"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RefreshCw, Calendar, Mail, Users } from "lucide-react";
import { toast } from "sonner";

export default function MicrosoftIntegrationPage() {
  const handleManualSync = () => {
    toast.success("Microsoft 365 Sync completed (Outlook Calendar, Mail & Contacts up-to-date)");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-zinc-800/80 pb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/integrations">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Hub
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Microsoft 365 Integration
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Outlook Calendar, Outlook Mail, and Microsoft Graph Contacts Synchronization
            </p>
          </div>
        </div>

        <Badge variant="emerald">CONNECTED (Microsoft Graph)</Badge>
      </div>

      {/* Sync Status & Action Bar */}
      <Card className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">Microsoft Entra ID / 365 Account</h2>
            <p className="text-xs text-zinc-400">Connected Account: <strong className="text-zinc-300">alex@leadpilot.onmicrosoft.com</strong></p>
          </div>
          <Button variant="primary" size="sm" onClick={handleManualSync}>
            <RefreshCw className="w-3.5 h-3.5 mr-2" /> Sync Now
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-zinc-800">
          <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800/80 space-y-1">
            <div className="flex items-center gap-2 text-white text-xs font-semibold">
              <Calendar className="w-4 h-4 text-blue-400" /> Outlook Calendar
            </div>
            <p className="text-[11px] text-zinc-400">Real-time Graph Delta Sync</p>
          </div>

          <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800/80 space-y-1">
            <div className="flex items-center gap-2 text-white text-xs font-semibold">
              <Mail className="w-4 h-4 text-rose-400" /> Outlook Mail
            </div>
            <p className="text-[11px] text-zinc-400">Auto-append email interactions</p>
          </div>

          <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800/80 space-y-1">
            <div className="flex items-center gap-2 text-white text-xs font-semibold">
              <Users className="w-4 h-4 text-emerald-400" /> Microsoft Contacts
            </div>
            <p className="text-[11px] text-zinc-400">Conflict handling: LeadPilot Priority</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
