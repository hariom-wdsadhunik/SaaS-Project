"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminService } from "@/domain/admin/AdminService";
import { ArrowLeft, Database, RefreshCw, HardDrive } from "lucide-react";
import { toast } from "sonner";

export default function SystemOperationsPage() {
  const backups = AdminService.getBackups();

  const handleTriggerBackup = () => {
    toast.success("Triggered automated full database backup job");
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
              <HardDrive className="w-6 h-6 text-blue-400" />
              System Operations, Backup &amp; Disaster Recovery
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Automated database snapshot history, retention policies, and SHA-256 integrity verification
            </p>
          </div>
        </div>

        <Button variant="primary" size="sm" onClick={handleTriggerBackup}>
          <RefreshCw className="w-4 h-4 mr-2" /> Trigger Backup Now
        </Button>
      </div>

      {/* Backup History Table */}
      <Card className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-400" /> Automated Snapshot History
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3">Backup File</th>
                <th className="py-2.5 px-3">Size</th>
                <th className="py-2.5 px-3">Retention</th>
                <th className="py-2.5 px-3">Checksum (SHA-256)</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {backups.map((b) => (
                <tr key={b.id} className="hover:bg-zinc-800/40">
                  <td className="py-3 px-3 font-semibold text-white">{b.filename}</td>
                  <td className="py-3 px-3 text-zinc-300">{(b.sizeBytes / 1000000).toFixed(1)} MB</td>
                  <td className="py-3 px-3 text-zinc-300">{b.retentionDays} Days</td>
                  <td className="py-3 px-3 font-mono text-zinc-500 text-[11px] truncate max-w-[200px]">
                    {b.checksumSha256}
                  </td>
                  <td className="py-3 px-3">
                    <Badge variant="emerald">{b.status}</Badge>
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
