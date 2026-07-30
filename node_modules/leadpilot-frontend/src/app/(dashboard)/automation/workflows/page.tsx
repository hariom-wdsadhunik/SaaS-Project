"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { WorkflowEngine } from "@/domain/automation/WorkflowEngine";
import { WorkflowRule, WorkflowTriggerType } from "@/domain/automation/WorkflowTypes";
import { Zap, Search, ArrowLeft, Plus, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function WorkflowsPage() {
  const [query, setQuery] = React.useState("");
  const [workflows, setWorkflows] = React.useState<WorkflowRule[]>([]);
  const [isCreating, setIsCreating] = React.useState(false);
  const [newRuleName, setNewRuleName] = React.useState("");
  const [newRuleTrigger, setNewRuleTrigger] = React.useState<WorkflowTriggerType>("LEAD_CREATED");

  React.useEffect(() => {
    WorkflowEngine.getWorkflows().then(setWorkflows);
  }, []);

  const handleToggle = async (id: string) => {
    const nextState = await WorkflowEngine.toggleWorkflow(id);
    setWorkflows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, enabled: nextState } : w))
    );
    toast.info(`Workflow rule ${nextState ? "activated" : "paused"}`);
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName) return;

    const rule: WorkflowRule = {
      id: `wf-${Date.now()}`,
      name: newRuleName,
      description: `Custom workflow rule for trigger ${newRuleTrigger}`,
      enabled: true,
      trigger: newRuleTrigger,
      conditions: [],
      actions: [{ id: `act-${Date.now()}`, type: "SEND_EMAIL", config: {} }],
      organizationId: "org-1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setWorkflows((prev) => [rule, ...prev]);
    setNewRuleName("");
    setIsCreating(false);
    toast.success(`Created custom workflow "${rule.name}"`);
  };

  const filteredWorkflows = workflows.filter(
    (w) =>
      w.name.toLowerCase().includes(query.toLowerCase()) ||
      w.description.toLowerCase().includes(query.toLowerCase()) ||
      w.trigger.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-zinc-800/80 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/automation">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Automation
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-400" />
              Workflow Rules &amp; Visual Builder
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Configure event-driven trigger rules, condition evaluation trees, and automated actions
            </p>
          </div>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsCreating(!isCreating)}>
          <Plus className="w-4 h-4 mr-2" /> New Workflow Rule
        </Button>
      </div>

      {/* New Rule Modal Form Card */}
      {isCreating && (
        <Card className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4 animate-in slide-in-from-top-2">
          <h2 className="text-base font-semibold text-white">Create Custom Workflow Rule</h2>
          <form onSubmit={handleCreateRule} className="flex flex-col sm:flex-row items-end gap-4">
            <div className="flex-1 space-y-1.5 w-full">
              <label className="text-xs font-medium text-zinc-300">Rule Name</label>
              <Input
                value={newRuleName}
                onChange={(e) => setNewRuleName(e.target.value)}
                placeholder="e.g. Urgent Lead WhatsApp Broadcast"
                required
              />
            </div>

            <div className="w-full sm:w-60 space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Event Trigger</label>
              <select
                value={newRuleTrigger}
                onChange={(e) => setNewRuleTrigger(e.target.value as WorkflowTriggerType)}
                className="w-full bg-zinc-950 text-xs font-medium text-white border border-zinc-800 rounded-lg px-3 py-2 focus:outline-none"
              >
                <option value="LEAD_CREATED">LEAD_CREATED</option>
                <option value="LEAD_UPDATED">LEAD_UPDATED</option>
                <option value="LEAD_ASSIGNED">LEAD_ASSIGNED</option>
                <option value="DEAL_CREATED">DEAL_CREATED</option>
                <option value="DEAL_WON">DEAL_WON</option>
                <option value="DEAL_LOST">DEAL_LOST</option>
                <option value="TASK_CREATED">TASK_CREATED</option>
                <option value="TASK_COMPLETED">TASK_COMPLETED</option>
                <option value="APPOINTMENT_CREATED">APPOINTMENT_CREATED</option>
                <option value="APPOINTMENT_COMPLETED">APPOINTMENT_COMPLETED</option>
                <option value="DOCUMENT_UPLOADED">DOCUMENT_UPLOADED</option>
                <option value="COMMUNICATION_RECEIVED">COMMUNICATION_RECEIVED</option>
                <option value="USER_INVITED">USER_INVITED</option>
                <option value="BILLING_UPDATED">BILLING_UPDATED</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Button type="submit" variant="primary">Create Rule</Button>
              <Button variant="outline" type="button" onClick={() => setIsCreating(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Filter & Search Bar */}
      <Card className="p-4 bg-zinc-900/80 border border-zinc-800 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search workflows by title, trigger, or description..."
            className="pl-9"
          />
        </div>
        <Badge variant="blue">{filteredWorkflows.length} Rules Active</Badge>
      </Card>

      {/* Workflows List */}
      <Card className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4">
        <div className="divide-y divide-zinc-800/80">
          {filteredWorkflows.map((wf) => (
            <div key={wf.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={wf.enabled ? "emerald" : "zinc"}>{wf.enabled ? "ENABLED" : "PAUSED"}</Badge>
                  <p className="text-sm font-semibold text-white">{wf.name}</p>
                </div>
                <p className="text-xs text-zinc-400">{wf.description}</p>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                    WHEN: {wf.trigger}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400">
                    THEN: {wf.actions.map((a) => a.type).join(", ")}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleToggle(wf.id)}>
                  {wf.enabled ? (
                    <ToggleRight className="w-4 h-4 text-emerald-400 mr-1" />
                  ) : (
                    <ToggleLeft className="w-4 h-4 text-zinc-500 mr-1" />
                  )}
                  {wf.enabled ? "Pause" : "Enable"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setWorkflows((prev) => prev.filter((w) => w.id !== wf.id));
                    toast.warning(`Deleted workflow "${wf.name}"`);
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
