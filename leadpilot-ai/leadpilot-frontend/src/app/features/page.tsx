import React from "react";
import Link from "next/link";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Platform Features — LeadPilot AI CRM",
  description: "Explore LeadPilot AI CRM platform capabilities: AI Workspace, Workflow Automation, RAG Knowledge Base, Analytics Engine, Omnichannel Messaging, and Document Storage.",
};

export default function FeaturesPage() {
  const featureList = [
    {
      title: "AI Workspace Copilot",
      category: "AI Platform",
      description: "Ask multi-domain queries across leads, contacts, deals, tasks, appointments, communications, documents, and analytics with real-time citations.",
    },
    {
      title: "Event-Driven Workflow Engine",
      category: "Automation",
      description: "Automate user reassignments, follow-up task generation, WhatsApp messaging, and email notifications when deals move stages.",
    },
    {
      title: "RAG Vector Knowledge Base",
      category: "Knowledge",
      description: "Perform semantic similarity vector search across client notes, email histories, meeting summaries, and OCR document text.",
    },
    {
      title: "11-KPI Engine & 30-Day Forecasts",
      category: "Analytics",
      description: "Track win rates, deal velocity, response times, and 30-day predictive revenue projections with TTL caching.",
    },
    {
      title: "Omnichannel Messaging Platform",
      category: "Communication",
      description: "Send WhatsApp, Email, and SMS messages directly from CRM timelines using native provider adapters.",
    },
    {
      title: "Intelligent Document Storage",
      category: "Documents",
      description: "Upload contracts with SHA-256 integrity verification, versioning, 50MB ceiling limits, and automatic timeline logging.",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      <MarketingNavbar />

      <section className="py-20 px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge variant="blue">Enterprise Capabilities</Badge>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Complete Feature Breakdown
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed">
            LeadPilot AI CRM consolidates sales pipeline management, customer intelligence, automated messaging, and document storage into a unified platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featureList.map((feat, idx) => (
            <Card key={idx} className="space-y-3">
              <Badge variant="zinc">{feat.category}</Badge>
              <h3 className="text-xl font-bold text-white">{feat.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{feat.description}</p>
            </Card>
          ))}
        </div>

        <div className="pt-8 text-center">
          <Link href="/register">
            <Button variant="primary" size="lg" className="px-8 py-3">
              Start Free Trial →
            </Button>
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
