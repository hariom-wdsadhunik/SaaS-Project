"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WorkflowEngine } from "@/domain/automation/WorkflowEngine";
import { WorkflowExecutionLog } from "@/domain/automation/WorkflowTypes";
import { History, ArrowLeft, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function ExecutionHistoryPage() {
  const [logs, setLogs] = React.useState<WorkflowExecutionLog[]>([]);

  React.useEffect(() => {
    WorkflowEngine.getExecutionHistory().then(setLogs);
  }, []);

  const handleRetry = (log: WorkflowExecutionLog) => {
    toast.info(`Triggered manual retry for execution ${log.id}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-zinc-800/80 pb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/automation">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Automation
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <History className="w-6 h-6 text-rose-400" />
              Workflow Execution Audit Log
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Detailed audit trail of workflow triggers, execution latency, results, and retry operations
            </p>
          </div>
        </div>

        <Badge variant="rose">{logs.length} Total Execution Records</Badge>
      </div>

      {/* Execution Logs Table */}
      <Card className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4">
        <div className="divide-y divide-zinc-800/80">
          {logs.map((log) => (
            <div key={log.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                {log.result === "SUCCESS" ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white">{log.workflowName}</p>
                    <Badge variant={log.result === "SUCCESS" ? "emerald" : "rose"}>
                      {log.result}
                    </Badge>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">{log.details}</p>
                  <div className="flex items-center gap-2 mt-1 font-mono text-[10px] text-zinc-500">
                    <span>Trigger: {log.trigger}</span>
                    <span>•</span>
                    <span>Duration: {log.durationMs}ms</span>
                    <span>•</span>
                    <span>Retries: {log.retries}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-mono text-zinc-500">
                  {new Date(log.executionTime).toLocaleString()}
                </span>
                <Button variant="outline" size="sm" onClick={() => handleRetry(log)}>
                  <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
