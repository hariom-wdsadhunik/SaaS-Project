"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WorkflowEngine } from "@/domain/automation/WorkflowEngine";
import { WorkflowRule, WorkflowExecutionLog } from "@/domain/automation/WorkflowTypes";
import { Zap, Play, History, LayoutTemplate, CheckCircle2, AlertCircle, ArrowRight, Plus } from "lucide-react";

export default function AutomationOverviewPage() {
  const [workflows, setWorkflows] = React.useState<WorkflowRule[]>([]);
  const [logs, setLogs] = React.useState<WorkflowExecutionLog[]>([]);

  React.useEffect(() => {
    WorkflowEngine.getWorkflows().then(setWorkflows);
    WorkflowEngine.getExecutionHistory().then(setLogs);
  }, []);

  const activeCount = workflows.filter((w) => w.enabled).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-zinc-800/80 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-amber-400" />
            Visual Workflow Automation Engine
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Automate CRM processes, multi-channel notifications, deal stage updates, and AI actions
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/automation/workflows">
            <Button variant="primary" size="sm">
              <Plus className="w-4 h-4 mr-2" /> Create Custom Workflow
            </Button>
          </Link>
          <Link href="/automation/templates">
            <Button variant="outline" size="sm">
              <LayoutTemplate className="w-4 h-4 mr-2 text-blue-400" /> Templates
            </Button>
          </Link>
          <Link href="/automation/history">
            <Button variant="outline" size="sm">
              <History className="w-4 h-4 mr-2 text-rose-400" /> Execution History
            </Button>
          </Link>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-zinc-900/80 border border-zinc-800 space-y-1">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Active Workflows</p>
          <p className="text-2xl font-bold text-white">{activeCount} / {workflows.length}</p>
          <p className="text-[11px] text-emerald-400">100% Operational Status</p>
        </Card>
        <Card className="p-4 bg-zinc-900/80 border border-zinc-800 space-y-1">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Executions (24h)</p>
          <p className="text-2xl font-bold text-white">1,482 Runs</p>
          <p className="text-[11px] text-emerald-400">+12.4% vs yesterday</p>
        </Card>
        <Card className="p-4 bg-zinc-900/80 border border-zinc-800 space-y-1">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Avg Latency</p>
          <p className="text-2xl font-bold text-white">185 ms</p>
          <p className="text-[11px] text-blue-400">Sub-second execution</p>
        </Card>
        <Card className="p-4 bg-zinc-900/80 border border-zinc-800 space-y-1">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Success Rate</p>
          <p className="text-2xl font-bold text-emerald-400">99.8%</p>
          <p className="text-[11px] text-zinc-400">0 critical failures</p>
        </Card>
      </div>

      {/* Active Workflows Highlights */}
      <Card className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Play className="w-4 h-4 text-emerald-400" /> Active Automation Rules
          </h2>
          <Link href="/automation/workflows" className="text-xs text-blue-400 hover:underline flex items-center gap-1">
            View All Workflows <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-zinc-800/80">
          {workflows.map((wf) => (
            <div key={wf.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={wf.enabled ? "emerald" : "zinc"}>{wf.enabled ? "ACTIVE" : "PAUSED"}</Badge>
                  <p className="text-sm font-semibold text-white">{wf.name}</p>
                </div>
                <p className="text-xs text-zinc-400">{wf.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] uppercase font-mono text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                    Trigger: {wf.trigger}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {wf.actions.length} Action(s) configured
                  </span>
                </div>
              </div>

              <Link href="/automation/workflows">
                <Button variant="outline" size="sm">Configure Rule</Button>
              </Link>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Execution Logs */}
      <Card className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <History className="w-4 h-4 text-rose-400" /> Recent Execution Stream
          </h2>
          <Link href="/automation/history" className="text-xs text-blue-400 hover:underline flex items-center gap-1">
            View Full Audit Log <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-zinc-800/80">
          {logs.map((log) => (
            <div key={log.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {log.result === "SUCCESS" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <div>
                  <p className="text-sm font-semibold text-white">{log.workflowName}</p>
                  <p className="text-xs text-zinc-400">{log.details}</p>
                </div>
              </div>

              <div className="text-right text-xs font-mono text-zinc-500">
                <p>{log.durationMs}ms</p>
                <p>{new Date(log.executionTime).toLocaleTimeString()}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
