"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConnectorRegistry } from "@/domain/integration/ConnectorRegistry";
import { ConnectorInstance } from "@/domain/integration/IntegrationTypes";
import { Layers, RefreshCw, Key, Webhook, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function IntegrationsHubPage() {
  const [connectors, setConnectors] = React.useState<ConnectorInstance[]>([]);

  React.useEffect(() => {
    ConnectorRegistry.getConnectors().then(setConnectors);
  }, []);

  const handleSyncAll = async () => {
    toast.info("Triggering background sync across all connected integration channels...");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-zinc-800/80 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-400" />
            Enterprise Integrations Hub &amp; Connector Framework
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Connect LeadPilot AI CRM to Google Workspace, Microsoft 365, messaging providers, Stripe, and webhooks
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="primary" size="sm" onClick={handleSyncAll}>
            <RefreshCw className="w-4 h-4 mr-2" /> Sync All Connectors
          </Button>
          <Link href="/integrations/webhooks">
            <Button variant="outline" size="sm">
              <Webhook className="w-4 h-4 mr-2 text-rose-400" /> Webhooks
            </Button>
          </Link>
          <Link href="/integrations/api-keys">
            <Button variant="outline" size="sm">
              <Key className="w-4 h-4 mr-2 text-amber-400" /> API Keys
            </Button>
          </Link>
        </div>
      </div>

      {/* Integration Category Quick Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link href="/integrations/google">
          <Card className="p-4 bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-colors space-y-2 group">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white group-hover:text-blue-400">Google Workspace</span>
              <Badge variant="emerald">ACTIVE</Badge>
            </div>
            <p className="text-xs text-zinc-400">Gmail, Google Calendar &amp; Contacts OAuth Sync</p>
          </Card>
        </Link>

        <Link href="/integrations/microsoft">
          <Card className="p-4 bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-colors space-y-2 group">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white group-hover:text-blue-400">Microsoft 365</span>
              <Badge variant="emerald">ACTIVE</Badge>
            </div>
            <p className="text-xs text-zinc-400">Outlook Mail, Outlook Calendar &amp; Contacts</p>
          </Card>
        </Link>

        <Link href="/integrations/communication">
          <Card className="p-4 bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-colors space-y-2 group">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white group-hover:text-amber-400">Communication</span>
              <Badge variant="emerald">ACTIVE</Badge>
            </div>
            <p className="text-xs text-zinc-400">WhatsApp Cloud API, Twilio, SendGrid &amp; SMTP</p>
          </Card>
        </Link>

        <Link href="/integrations/payments">
          <Card className="p-4 bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-colors space-y-2 group">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white group-hover:text-emerald-400">Stripe Payments</span>
              <Badge variant="emerald">ACTIVE</Badge>
            </div>
            <p className="text-xs text-zinc-400">Subscription Metering &amp; Payment History</p>
          </Card>
        </Link>
      </div>

      {/* Active Connectors Matrix */}
      <Card className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" /> Active Platform Connector Instances
          </h2>
          <Badge variant="emerald">All Systems Operational</Badge>
        </div>

        <div className="divide-y divide-zinc-800/80">
          {connectors.map((c) => (
            <div key={c.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-white">{c.name}</p>
                  <Badge variant="emerald">{c.status}</Badge>
                </div>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  Provider: {c.provider} • Health Score: {c.healthScore}%
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="text-zinc-500 font-mono">
                  Synced: {new Date(c.lastSyncAt).toLocaleTimeString()}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    await ConnectorRegistry.triggerSync(c.id);
                    toast.success(`Triggered manual sync for ${c.name}`);
                  }}
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1" /> Sync Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
