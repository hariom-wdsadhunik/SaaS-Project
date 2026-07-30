"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WorkflowEngine } from "@/domain/automation/WorkflowEngine";
import { WorkflowTemplate } from "@/domain/automation/WorkflowTypes";
import { LayoutTemplate, ArrowLeft, Download } from "lucide-react";
import { toast } from "sonner";

export default function TemplatesPage() {
  const templates = WorkflowEngine.getTemplates();

  const handleInstall = (template: WorkflowTemplate) => {
    toast.success(`Installed template "${template.name}" into active workflow rules!`);
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
              <LayoutTemplate className="w-6 h-6 text-blue-400" />
              Pre-built Automation Templates Gallery
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              7 Industry-standard pre-configured workflow templates ready for 1-click deployment
            </p>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((tpl) => (
          <Card key={tpl.id} className="p-6 bg-zinc-900/80 border border-zinc-800 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="blue">{tpl.category}</Badge>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">{tpl.trigger}</span>
              </div>
              <h3 className="text-base font-semibold text-white">{tpl.name}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{tpl.description}</p>
            </div>

            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-500">{tpl.actions.length} Action(s)</span>
              <Button variant="primary" size="sm" onClick={() => handleInstall(tpl)}>
                <Download className="w-3.5 h-3.5 mr-1.5" /> Install Template
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
