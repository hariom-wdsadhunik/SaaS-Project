"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminService } from "@/domain/admin/AdminService";
import { RefreshCw, ArrowLeft, RotateCw } from "lucide-react";
import { toast } from "sonner";

export default function AdminBackgroundJobsPage() {
  const jobs = AdminService.getBackgroundJobs();

  const handleRetryFailed = () => {
    toast.info("Triggered retry for failed queue items");
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
              <RefreshCw className="w-6 h-6 text-amber-400" />
              Background Jobs &amp; Retry Queue Manager
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              BullMQ job worker queues, cron scheduler status, failed task retries, and job execution history
            </p>
          </div>
        </div>

        <Button variant="primary" size="sm" onClick={handleRetryFailed}>
          <RotateCw className="w-4 h-4 mr-2" /> Retry Failed Jobs
        </Button>
      </div>

      <Card className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4">
        <h2 className="text-base font-semibold text-white">Active &amp; Historical Worker Jobs</h2>

        <div className="divide-y divide-zinc-800/80">
          {jobs.map((job) => (
            <div key={job.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={job.status === "COMPLETED" ? "emerald" : job.status === "RUNNING" ? "amber" : "rose"}>
                    {job.status}
                  </Badge>
                  <p className="text-sm font-semibold text-white">{job.name}</p>
                </div>
                <p className="text-xs text-zinc-400">
                  Queue: <span className="font-mono text-zinc-300">{job.queue}</span> • Attempts: {job.attempts}/{job.maxAttempts}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-zinc-500">
                  Scheduled: {new Date(job.scheduledAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
