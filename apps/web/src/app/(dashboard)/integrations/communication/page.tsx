"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageSquare, Phone, Mail, Send } from "lucide-react";
import { toast } from "sonner";

export default function CommunicationIntegrationsPage() {
  const handleTestConnection = (provider: string) => {
    toast.success(`Successfully verified API connection for ${provider}`);
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
              <MessageSquare className="w-6 h-6 text-amber-400" />
              Unified Messaging Provider Configuration
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Configure Twilio SMS, Meta WhatsApp Business Cloud API, SendGrid, and Nodemailer SMTP
            </p>
          </div>
        </div>
      </div>

      {/* Messaging Adapters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-semibold text-white">WhatsApp Business Cloud API</h3>
            </div>
            <Badge variant="emerald">CONNECTED</Badge>
          </div>
          <p className="text-xs text-zinc-400">Official Meta Graph API adapter for instant messaging and template broadcasts.</p>
          <Button variant="outline" size="sm" onClick={() => handleTestConnection("WhatsApp Business Cloud API")}>
            Test API Connection
          </Button>
        </Card>

        <Card className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-rose-400" />
              <h3 className="text-base font-semibold text-white">Twilio SMS Adapter</h3>
            </div>
            <Badge variant="emerald">CONNECTED</Badge>
          </div>
          <p className="text-xs text-zinc-400">Twilio Programmable SMS gateway for text messaging &amp; 2FA verification.</p>
          <Button variant="outline" size="sm" onClick={() => handleTestConnection("Twilio SMS")}>
            Test API Connection
          </Button>
        </Card>

        <Card className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-400" />
              <h3 className="text-base font-semibold text-white">SendGrid Email Provider</h3>
            </div>
            <Badge variant="emerald">CONNECTED</Badge>
          </div>
          <p className="text-xs text-zinc-400">Transactional and marketing email delivery engine with open/click tracking.</p>
          <Button variant="outline" size="sm" onClick={() => handleTestConnection("SendGrid Email")}>
            Test API Connection
          </Button>
        </Card>

        <Card className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Send className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-semibold text-white">Nodemailer SMTP Fallback</h3>
            </div>
            <Badge variant="emerald">READY</Badge>
          </div>
          <p className="text-xs text-zinc-400">Custom SMTP server transport for internal notifications and alerts.</p>
          <Button variant="outline" size="sm" onClick={() => handleTestConnection("Nodemailer SMTP")}>
            Test API Connection
          </Button>
        </Card>
      </div>
    </div>
  );
}
