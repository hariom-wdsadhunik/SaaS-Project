"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ReportingEngine } from "@/domain/reporting/ReportingEngine";
import { ScheduledReportConfig } from "@/domain/reporting/ReportingTypes";
import { Calendar, ArrowLeft, Plus, Send } from "lucide-react";
import { toast } from "sonner";

export default function ScheduledReportsPage() {
  const [scheduled, setScheduled] = React.useState<ScheduledReportConfig[]>(() =>
    ReportingEngine.getScheduledReports()
  );
  const [reportName, setReportName] = React.useState("");
  const [recipientEmail, setRecipientEmail] = React.useState("");

  const handleScheduleReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportName || !recipientEmail) return;

    const item: ScheduledReportConfig = {
      id: `sched-${Date.now()}`,
      name: reportName,
      reportType: "EXECUTIVE",
      frequency: "WEEKLY",
      recipients: [recipientEmail],
      format: "PDF",
      enabled: true,
      nextScheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    };

    setScheduled((prev) => [item, ...prev]);
    setReportName("");
    setRecipientEmail("");
    toast.success(`Scheduled recurring report "${item.name}" to ${recipientEmail}`);
  };

  const handleTestSend = (name: string) => {
    toast.info(`Dispatched manual report delivery for "${name}"`);
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
              <Calendar className="w-6 h-6 text-amber-400" />
              Scheduled Automated Email Reports
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Configure daily, weekly, monthly, and quarterly PDF/CSV report dispatches to stakeholders
            </p>
          </div>
        </div>

        <Badge variant="amber">{scheduled.length} Scheduled Dispatches</Badge>
      </div>

      {/* Schedule Form Card */}
      <Card className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-amber-400" /> Schedule Recurring Report
        </h2>

        <form onSubmit={handleScheduleReport} className="flex flex-col sm:flex-row items-end gap-4">
          <div className="flex-1 space-y-1.5 w-full">
            <label className="text-xs font-medium text-zinc-300">Report Name</label>
            <Input
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              placeholder="e.g. Weekly Sales &amp; Revenue Brief"
              required
            />
          </div>

          <div className="flex-1 space-y-1.5 w-full">
            <label className="text-xs font-medium text-zinc-300">Recipient Email</label>
            <Input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="executive@company.com"
              required
            />
          </div>

          <Button type="submit" variant="primary">
            Schedule Delivery
          </Button>
        </form>
      </Card>

      {/* Scheduled Reports List */}
      <Card className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4">
        <h2 className="text-base font-semibold text-white">Active Report Schedules</h2>

        <div className="divide-y divide-zinc-800/80">
          {scheduled.map((item) => (
            <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="emerald">{item.frequency}</Badge>
                  <p className="text-sm font-semibold text-white">{item.name}</p>
                </div>
                <p className="text-xs text-zinc-400">
                  Recipients: <span className="font-mono text-zinc-300">{item.recipients.join(", ")}</span> • Format: <Badge variant="zinc">{item.format}</Badge>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-zinc-500 mr-2">
                  Next: {new Date(item.nextScheduledAt).toLocaleDateString()}
                </span>
                <Button variant="outline" size="sm" onClick={() => handleTestSend(item.name)}>
                  <Send className="w-3.5 h-3.5 mr-1" /> Send Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
