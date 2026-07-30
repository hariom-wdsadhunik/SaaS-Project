"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ReportingEngine } from "@/domain/reporting/ReportingEngine";
import { CustomDashboardLayout } from "@/domain/reporting/ReportingTypes";
import { ArrowLeft, LayoutGrid, Plus, Share2, Save } from "lucide-react";
import { toast } from "sonner";

export default function CustomDashboardBuilderPage() {
  const [dashboards, setDashboards] = React.useState<CustomDashboardLayout[]>(() =>
    ReportingEngine.getCustomDashboards()
  );
  const [newTitle, setNewTitle] = React.useState("");

  const handleCreateDashboard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const layout: CustomDashboardLayout = {
      id: `dash-${Date.now()}`,
      name: newTitle,
      description: "Custom drag-and-drop user created dashboard layout",
      organizationId: "org-1",
      ownerId: "usr-1",
      isShared: true,
      widgets: [
        { id: `w-${Date.now()}`, title: "Lead Source Distribution", chartType: "DONUT", metricKey: "kpi-conv", gridSpan: 2 },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDashboards((prev) => [layout, ...prev]);
    setNewTitle("");
    toast.success(`Created custom dashboard "${layout.name}"`);
  };

  const handleShare = (name: string) => {
    toast.info(`Generated sharing link for "${name}"`);
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
              <LayoutGrid className="w-6 h-6 text-amber-400" />
              Custom Dashboard Builder &amp; Widget Studio
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Construct personalized analytics dashboards, reorder widgets, and share organization layouts
            </p>
          </div>
        </div>
      </div>

      {/* Create Dashboard Form */}
      <Card className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-amber-400" /> Create Custom Layout
        </h2>

        <form onSubmit={handleCreateDashboard} className="flex flex-col sm:flex-row items-end gap-4">
          <div className="flex-1 space-y-1.5 w-full">
            <label className="text-xs font-medium text-zinc-300">Dashboard Title</label>
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Q3 Sales &amp; Lead Conversion Matrix"
              required
            />
          </div>

          <Button type="submit" variant="primary">
            <Save className="w-4 h-4 mr-2" /> Save Dashboard
          </Button>
        </form>
      </Card>

      {/* Saved Dashboards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dashboards.map((dash) => (
          <Card key={dash.id} className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">{dash.name}</h3>
                <p className="text-xs text-zinc-400">{dash.description}</p>
              </div>
              <Badge variant="blue">{dash.widgets.length} Widget(s)</Badge>
            </div>

            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-500">
                Created: {new Date(dash.createdAt).toLocaleDateString()}
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleShare(dash.name)}>
                  <Share2 className="w-3.5 h-3.5 mr-1" /> Share
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
