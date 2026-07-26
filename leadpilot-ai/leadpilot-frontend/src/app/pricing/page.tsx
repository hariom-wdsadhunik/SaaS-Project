import React from "react";
import Link from "next/link";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Pricing Plans — LeadPilot AI CRM",
  description: "Flexible, transparent pricing plans for sales teams of all sizes. Starter, Professional, and Enterprise tiers.",
};

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "$49",
      period: "/user/month",
      badge: "Small Teams",
      description: "Essential CRM features for boutique brokerages and independent agents.",
      features: [
        "Up to 5 Users",
        "Lead & Deal Kanban Pipeline",
        "Basic AI Copilot Queries",
        "Standard Email Integration",
        "10GB Document Storage",
      ],
      buttonText: "Start Free Trial",
      variant: "outline" as const,
    },
    {
      name: "Professional",
      price: "$149",
      period: "/user/month",
      badge: "Most Popular",
      description: "Advanced automation, analytics, and omnichannel messaging for high-growth teams.",
      features: [
        "Up to 25 Users",
        "Event-Driven Workflow Engine",
        "Omnichannel (WhatsApp, SMS, Email)",
        "11-KPI Engine & 30-Day Forecasts",
        "RAG Knowledge Base (100GB)",
        "SHA-256 Checksum Storage",
      ],
      buttonText: "Start Professional Trial",
      variant: "primary" as const,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "Billed annually",
      badge: "Enterprise GA",
      description: "Dedicated infrastructure, custom SLA, organization RLS boundaries, and 24/7 support.",
      features: [
        "Unlimited Users",
        "Custom Workflow Action Runners",
        "Dedicated Vector Store Architecture",
        "Multi-Tenant Isolation Middleware",
        "Full Observability & Audit Logs",
        "99.99% Guaranteed Uptime SLA",
      ],
      buttonText: "Contact Enterprise Sales",
      variant: "secondary" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      <MarketingNavbar />

      <section className="py-20 px-6 max-w-6xl mx-auto text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Flexible Plans for Growing Teams</h1>
        <p className="text-zinc-400 text-base max-w-xl mx-auto">
          Choose the plan that fits your revenue team. Upgrade or cancel anytime.
        </p>

        <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {plans.map((plan, idx) => (
            <Card key={idx} className="flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                  <Badge variant={idx === 1 ? "blue" : "zinc"}>{plan.badge}</Badge>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">{plan.description}</p>
                <div className="pt-2">
                  <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                  <span className="text-xs text-zinc-500 ml-1">{plan.period}</span>
                </div>

                <ul className="space-y-2.5 pt-4 border-t border-zinc-800 text-xs text-zinc-300">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center space-x-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link href="/register" className="w-full">
                <Button variant={plan.variant} className="w-full">
                  {plan.buttonText}
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
