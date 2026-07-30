"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ConnectorRegistry } from "@/domain/integration/ConnectorRegistry";
import { ApiKeyRecord } from "@/domain/integration/IntegrationTypes";
import { Key, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function ApiKeysPage() {
  const [keys, setKeys] = React.useState<ApiKeyRecord[]>([]);
  const [newKeyName, setNewKeyName] = React.useState("");

  React.useEffect(() => {
    ConnectorRegistry.getApiKeys().then(setKeys);
  }, []);

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName) return;

    const newKey = await ConnectorRegistry.createApiKey(newKeyName, ["leads:read", "leads:write", "deals:read"]);
    setKeys((prev) => [newKey, ...prev]);
    setNewKeyName("");
    toast.success(`Generated API Key "${newKey.name}" (${newKey.prefix})`);
  };

  const handleRevoke = (id: string) => {
    setKeys((prev) => prev.map((k) => (k.id === id ? { ...k, status: "REVOKED" } : k)));
    toast.warning("API Key revoked");
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
              <Key className="w-6 h-6 text-amber-400" />
              Scoped API Key Management &amp; Access Controls
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Generate, rotate, and revoke scoped API keys for external REST API access and custom integrations
            </p>
          </div>
        </div>
      </div>

      {/* Generate API Key Form */}
      <Card className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-amber-400" /> Generate New API Key
        </h2>

        <form onSubmit={handleCreateKey} className="flex flex-col sm:flex-row items-end gap-4">
          <div className="flex-1 space-y-1.5 w-full">
            <label className="text-xs font-medium text-zinc-300">Key Name / Description</label>
            <Input
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="e.g. Production Data Pipeline Key"
              required
            />
          </div>

          <Button type="submit" variant="primary">
            Generate Key
          </Button>
        </form>
      </Card>

      {/* API Keys Table */}
      <Card className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4">
        <h2 className="text-base font-semibold text-white">Active API Keys ({keys.length})</h2>

        <div className="divide-y divide-zinc-800/80">
          {keys.map((k) => (
            <div key={k.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={k.status === "ACTIVE" ? "emerald" : "rose"}>{k.status}</Badge>
                  <p className="text-sm font-semibold text-white">{k.name}</p>
                </div>
                <p className="text-xs font-mono text-zinc-400">
                  Prefix: <span className="text-amber-400">{k.prefix}</span> • Scopes: {k.scopes.join(", ")}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleRevoke(k.id)}>
                  <Trash2 className="w-3.5 h-3.5 text-rose-400 mr-1" /> Revoke Key
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
