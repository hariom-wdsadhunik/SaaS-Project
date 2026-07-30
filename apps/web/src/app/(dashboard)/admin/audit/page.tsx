"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminService } from "@/domain/admin/AdminService";
import { Lock, ArrowLeft, ShieldAlert, Download } from "lucide-react";
import { toast } from "sonner";

export default function AdminAuditSocPage() {
  const events = AdminService.getSecurityEvents();

  const handleExportSoc = () => {
    toast.success("Exported SOC Security Audit Log to CSV");
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
              <Lock className="w-6 h-6 text-rose-500" />
              Security Operations Center (SOC) &amp; Audit Logs
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Failed authentication attempts, API usage anomaly alerts, role elevations, and tamper-proof audit trails
            </p>
          </div>
        </div>

        <Button variant="primary" size="sm" onClick={handleExportSoc}>
          <Download className="w-4 h-4 mr-2" /> Export Audit Log
        </Button>
      </div>

      <Card className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-400" /> Live Security Events
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3">Event Type</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Source IP</th>
                <th className="py-2.5 px-3">Target User</th>
                <th className="py-2.5 px-3">Details</th>
                <th className="py-2.5 px-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {events.map((ev) => (
                <tr key={ev.id} className="hover:bg-zinc-800/40">
                  <td className="py-3 px-3 font-semibold text-white">{ev.type}</td>
                  <td className="py-3 px-3">
                    <Badge variant={ev.severity === "CRITICAL" || ev.severity === "HIGH" ? "rose" : "amber"}>
                      {ev.severity}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 font-mono text-zinc-300">{ev.sourceIp}</td>
                  <td className="py-3 px-3 text-zinc-300">{ev.userEmail || "N/A"}</td>
                  <td className="py-3 px-3 text-zinc-400 max-w-[280px]">{ev.details}</td>
                  <td className="py-3 px-3 font-mono text-zinc-500 text-[11px]">
                    {new Date(ev.timestamp).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
