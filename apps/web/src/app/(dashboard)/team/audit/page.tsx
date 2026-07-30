"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AuditLogger } from "@/domain/organization/AuditLogger";
import { AuditRecord } from "@/domain/organization/OrganizationTypes";
import { FileText, ArrowLeft, Clock } from "lucide-react";

export default function TeamAuditPage() {
  const [audits, setAudits] = React.useState<AuditRecord[]>([]);

  React.useEffect(() => {
    AuditLogger.getAudits().then(setAudits);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-zinc-800/80 pb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/team">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Team
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-rose-400" />
              Immutable Security Audit Log
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Compliance audit trail for authentication, permission shifts, billing actions, and data exports
            </p>
          </div>
        </div>

        <Badge variant="rose">Immutable SHA-256 Ledger</Badge>
      </div>

      {/* Audit Log Table */}
      <Card className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4">
        <div className="divide-y divide-zinc-800/80">
          {audits.map((aud) => (
            <div key={aud.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="rose">{aud.category}</Badge>
                  <p className="text-sm font-semibold text-white">{aud.action}</p>
                </div>
                <p className="text-xs text-zinc-400">
                  By <strong className="text-zinc-300">{aud.userEmail}</strong> (IP: <span className="font-mono text-zinc-400">{aud.ipAddress}</span>)
                </p>
                <p className="text-xs text-zinc-500 italic">{aud.details}</p>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono shrink-0">
                <Clock className="w-3.5 h-3.5" />
                <span>{new Date(aud.timestamp).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
