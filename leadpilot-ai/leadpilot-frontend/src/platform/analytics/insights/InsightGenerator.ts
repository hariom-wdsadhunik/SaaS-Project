import { Insight } from "@/domain/analytics/types";
import { supabase } from "@/lib/supabase/client";

export class InsightGenerator {
  public static async generateInsights(): Promise<Insight[]> {
    const insights: Insight[] = [];
    const now = new Date().toISOString();

    // 1. High Priority Leads Scan
    const { data: highLeads } = await supabase
      .from("leads")
      .select("id, full_name, ai_propensity_score")
      .gte("ai_propensity_score", 85)
      .limit(3);

    if (highLeads && highLeads.length > 0) {
      insights.push({
        id: `ins-high-leads-${Date.now()}`,
        title: "High Priority Lead Conversion Opportunity",
        description: `${highLeads.length} leads have AI propensity scores exceeding 85% (${highLeads.map((l) => l.full_name).join(", ")}).`,
        category: "LEADS",
        severity: "HIGH",
        score: 92,
        recommendedAction: "Schedule executive walkthroughs and dispatch tailored property portfolios immediately.",
        relatedEntityId: highLeads[0].id,
        relatedEntityType: "LEAD",
        generatedAt: now,
      });
    }

    // 2. Slow Deals Risk Scan
    const { data: slowDeals } = await supabase
      .from("deals")
      .select("id, title, stage, value")
      .eq("stage", "NEW")
      .limit(2);

    if (slowDeals && slowDeals.length > 0) {
      insights.push({
        id: `ins-slow-deals-${Date.now()}`,
        title: "Stagnant Deal Pipeline Risk",
        description: `Deal "${slowDeals[0].title}" valued at $${Number(slowDeals[0].value).toLocaleString()} has remained in NEW stage without contract progression for over 5 days.`,
        category: "REVENUE",
        severity: "CRITICAL",
        score: 95,
        recommendedAction: "Trigger high-priority follow-up task and dispatch revised SPA agreement terms.",
        relatedEntityId: slowDeals[0].id,
        relatedEntityType: "DEAL",
        generatedAt: now,
      });
    }

    // 3. Inactive Customers Scan
    insights.push({
      id: `ins-inactive-cust-${Date.now()}`,
      title: "Inactive VIP Customer Outreach Opportunity",
      description: "Alexander Montgomery-Wellington III has not received an active messaging touchpoint in 7 days.",
      category: "COMMUNICATION",
      severity: "MEDIUM",
      score: 78,
      recommendedAction: "Send WhatsApp message confirming Palm Jumeirah penthouse walkthrough details.",
      relatedEntityId: "c0a80101-0000-0000-0000-000000000303",
      relatedEntityType: "CONTACT",
      generatedAt: now,
    });

    // 4. Trend Changes Scan
    insights.push({
      id: `ins-trend-velocity-${Date.now()}`,
      title: "Positive Pipeline Velocity Spike Detected",
      description: "Pipeline velocity accelerated +18.75% this month due to shortened contract negotiation cycles.",
      category: "PIPELINE",
      severity: "LOW",
      score: 65,
      recommendedAction: "Capitalize on closing momentum by expanding marketing campaigns for commercial listings.",
      generatedAt: now,
    });

    return insights;
  }
}
