import React from "react";
import Link from "next/link";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "LeadPilot AI CRM — Intelligent Autonomous Sales Platform",
  description: "Close deals faster with LeadPilot AI CRM. Featuring real-time predictive analytics, automated workflows, RAG knowledge bases, and multi-domain AI copilot workspace.",
};

export default function MarketingHomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-blue-600 selection:text-white">
      <MarketingNavbar />

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-6 max-w-5xl mx-auto text-center space-y-8">
        <Badge variant="ai" className="px-4 py-1 text-xs font-semibold uppercase tracking-wider">
          Introducing LeadPilot AI Enterprise GA v2.0.0
        </Badge>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-500">
          The AI-Native CRM Built for High-Growth Sales
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed">
          Eliminate sales friction with autonomous AI copilots, event-driven workflows, 11-metric KPI analytics, and RAG vector search across every client deal.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <Link href="/register">
            <Button variant="primary" size="lg" className="w-full sm:w-auto text-base px-8 py-3">
              Start Free Trial →
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto text-base px-8 py-3">
              Explore Live Demo Portal
            </Button>
          </Link>
        </div>

        {/* Social Proof */}
        <div className="pt-12 border-t border-zinc-900 grid grid-cols-2 md:grid-cols-4 gap-6 opacity-60 text-xs font-semibold tracking-wider uppercase text-zinc-400">
          <div>Trusted by 500+ Brokerages</div>
          <div>$1.2B+ Pipeline Managed</div>
          <div>99.99% Uptime SLA</div>
          <div>Strict Multi-Tenant RLS</div>
        </div>
      </section>

      {/* Interactive Product Feature Cards */}
      <section className="py-20 px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-white">Engineered for Revenue Velocity</h2>
          <p className="text-zinc-400 text-sm">Everything you need to orchestrate complex B2B and real estate sales pipelines.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="space-y-4">
            <Badge variant="blue">AI Copilot Workspace</Badge>
            <h3 className="text-xl font-bold text-white">Multi-Domain Intelligence</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Ask complex queries across leads, contacts, deals, tasks, appointments, communications, and documents with citation tracking.
            </p>
          </Card>

          <Card className="space-y-4">
            <Badge variant="emerald">Workflow Engine</Badge>
            <h3 className="text-xl font-bold text-white">Event-Driven Automation</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Trigger automated tasks, user reassignments, WhatsApp messages, and email notifications when deals win or leads qualify.
            </p>
          </Card>

          <Card className="space-y-4">
            <Badge variant="amber">Predictive Analytics</Badge>
            <h3 className="text-xl font-bold text-white">11-KPI Engine & Forecasts</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Track conversion rates, deal velocity, response times, and 30-day predictive revenue projections with TTL caching.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center border-t border-zinc-900 space-y-6">
        <h2 className="text-4xl font-bold text-white">Ready to Transform Your Sales Operating System?</h2>
        <p className="text-zinc-400 text-base max-w-xl mx-auto">
          Join enterprise sales teams accelerating closing speed with LeadPilot AI CRM.
        </p>
        <Link href="/register">
          <Button variant="primary" size="lg" className="px-10 py-3.5 text-base">
            Get Started Now
          </Button>
        </Link>
      </section>

      <MarketingFooter />
    </div>
  );
}
