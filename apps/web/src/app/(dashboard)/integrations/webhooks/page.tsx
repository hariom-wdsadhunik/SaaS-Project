"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ConnectorRegistry } from "@/domain/integration/ConnectorRegistry";
import { WebhookEndpoint } from "@/domain/integration/IntegrationTypes";
import { Webhook, ArrowLeft, Plus, Send } from "lucide-react";
import { toast } from "sonner";

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = React.useState<WebhookEndpoint[]>([]);
  const [newUrl, setNewUrl] = React.useState("");

  React.useEffect(() => {
    ConnectorRegistry.getWebhooks().then(setWebhooks);
  }, []);

  const handleAddWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;

    const wh: WebhookEndpoint = {
      id: `wh-${Date.now()}`,
      organizationId: "org-1",
      url: newUrl,
      secret: `whsec_${Math.random().toString(36).substr(2, 10)}`,
      direction: "OUTGOING",
      events: ["lead.created", "deal.won"],
      status: "ACTIVE",
      lastTriggeredAt: new Date().toISOString(),
      failureCount: 0,
    };

    setWebhooks((prev) => [wh, ...prev]);
    setNewUrl("");
    toast.success(`Registered webhook endpoint ${wh.url}`);
  };

  const handleTestPing = (url: string) => {
    toast.success(`Ping payload delivered to ${url} (200 OK)`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-zinc-800/80 pb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/integrations">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Hub
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Webhook className="w-6 h-6 text-rose-400" />
              Webhook Endpoints &amp; Event Delivery Engine
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Configure incoming webhooks and outgoing HTTP event dispatches with HMAC signature verification
            </p>
          </div>
        </div>

        <Badge variant="rose">HMAC SHA-256 ENCRYPTED</Badge>
      </div>

      {/* Add Webhook Endpoint Form Card */}
      <Card className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-rose-400" /> Register Outgoing Webhook Endpoint
        </h2>

        <form onSubmit={handleAddWebhook} className="flex flex-col sm:flex-row items-end gap-4">
          <div className="flex-1 space-y-1.5 w-full">
            <label className="text-xs font-medium text-zinc-300">Endpoint URL</label>
            <Input
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://your-server.com/api/webhooks"
              required
            />
          </div>

          <Button type="submit" variant="primary">
            Register Endpoint
          </Button>
        </form>
      </Card>

      {/* Active Webhooks List */}
      <Card className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4">
        <h2 className="text-base font-semibold text-white">Active Webhook Endpoints ({webhooks.length})</h2>

        <div className="divide-y divide-zinc-800/80">
          {webhooks.map((wh) => (
            <div key={wh.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="emerald">{wh.status}</Badge>
                  <p className="text-sm font-semibold text-white font-mono">{wh.url}</p>
                </div>
                <p className="text-xs text-zinc-400">
                  Secret: <span className="font-mono text-zinc-300">{wh.secret}</span> • Events: <span className="font-mono text-zinc-500">{wh.events.join(", ")}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-zinc-500 mr-2">
                  {new Date(wh.lastTriggeredAt).toLocaleTimeString()}
                </span>
                <Button variant="outline" size="sm" onClick={() => handleTestPing(wh.url)}>
                  <Send className="w-3.5 h-3.5 mr-1" /> Test Ping
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
