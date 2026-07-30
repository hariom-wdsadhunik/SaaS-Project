"use client";

import * as React from "react";
import { CopilotSidebar } from "@/components/ai/copilot-sidebar";
import { CopilotChat } from "@/components/ai/copilot-chat";
import { CopilotContextPanel } from "@/components/ai/copilot-context-panel";
import { CopilotMessageItem } from "@/components/ai/copilot-message";
import { AIOrchestrator } from "@/domain/ai/orchestration/AIOrchestrator";
import { DailyBriefEngine } from "@/platform/copilot/DailyBriefEngine";
import { DealHealthEngine } from "@/platform/copilot/DealHealthEngine";
import { LeadSummaryEngine } from "@/platform/copilot/LeadSummaryEngine";
import { EmailCopilotService } from "@/platform/copilot/EmailCopilotService";
import { WhatsAppCopilotService } from "@/platform/copilot/WhatsAppCopilotService";
import { DailyBrief, DealHealthPrediction, LeadSummary } from "@/domain/copilot/CopilotTypes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Brain, Zap, Mail, MessageSquare, AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export default function CopilotPage() {
  const [conversations, setConversations] = React.useState([
    { id: "conv-1", title: "Marcus Vance Lead Qualification", updatedAt: new Date().toISOString() },
    { id: "conv-2", title: "Waterfront Penthouse Strategy", updatedAt: new Date().toISOString() },
  ]);
  const [activeConvId, setActiveConvId] = React.useState("conv-1");
  const [messages, setMessages] = React.useState<CopilotMessageItem[]>([
    {
      id: "msg-init",
      role: "assistant",
      content: "Hello! I am your AI Sales Copilot. How can I assist with deal strategies, lead summaries, or message drafting today?",
      provider: "ANTHROPIC",
      model: "claude-3-5-sonnet",
      tokensUsed: 42,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [dailyBrief, setDailyBrief] = React.useState<DailyBrief | null>(null);
  const [dealHealthList, setDealHealthList] = React.useState<DealHealthPrediction[]>([]);
  const [activeSummary, setActiveSummary] = React.useState<LeadSummary | null>(null);
  const [activeTab, setActiveTab] = React.useState<"command_center" | "chat">("command_center");

  React.useEffect(() => {
    DailyBriefEngine.generateDailyBrief().then(setDailyBrief);
    DealHealthEngine.predictAllDeals().then(setDealHealthList);
  }, []);

  const handleGenerateSummary = async () => {
    const summary = await LeadSummaryEngine.generateSummary("lead-101", {
      name: "Metro Commercial Group",
      budget: 5000000,
      location: "Financial Core",
    });
    setActiveSummary(summary);
    toast.success("AI Lead Summary Generated");
  };

  const handleDraftEmail = async () => {
    const res = await EmailCopilotService.processRequest({
      action: "generate_followup",
      recipientName: "Metro Commercial Group",
    });
    toast.success(res.actionTaken);
  };

  const handleDraftWhatsApp = async () => {
    const res = await WhatsAppCopilotService.processRequest({
      action: "draft_reply",
      contactName: "Metro Commercial Group",
    });
    toast.success(res.summary || "WhatsApp Draft Ready");
  };

  const handleSendMessage = async (prompt: string) => {
    const userMsg: CopilotMessageItem = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: prompt,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const aiRes = await AIOrchestrator.complete(prompt, "completion");
      const botMsg: CopilotMessageItem = {
        id: aiRes.id,
        role: "assistant",
        content: aiRes.text,
        provider: aiRes.provider,
        model: aiRes.model,
        tokensUsed: aiRes.tokensUsed,
        timestamp: aiRes.timestamp,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      toast.error("Failed to generate AI response.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: "msg-init-cleared",
        role: "assistant",
        content: "Chat cleared. What would you like assistance with?",
        provider: "ANTHROPIC",
        model: "claude-3-5-sonnet",
        tokensUsed: 12,
        timestamp: new Date().toISOString(),
      },
    ]);
    toast.info("Conversation cleared");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Title & View Switcher */}
      <div className="border-b border-zinc-800/80 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-400" />
            AI Command Center &amp; Copilot
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Proactive sales intelligence, deal health predictions &amp; automated assistant suite
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === "command_center" ? "primary" : "outline"}
            size="sm"
            onClick={() => setActiveTab("command_center")}
          >
            <Brain className="w-4 h-4 mr-2" />
            Command Center
          </Button>
          <Button
            variant={activeTab === "chat" ? "primary" : "outline"}
            size="sm"
            onClick={() => setActiveTab("chat")}
          >
            <Zap className="w-4 h-4 mr-2" />
            Interactive Chat
          </Button>
        </div>
      </div>

      {activeTab === "command_center" ? (
        <div className="space-y-6">
          {/* Daily AI Brief Section */}
          <Card className="p-6 bg-zinc-900/80 border border-zinc-800">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-400" />
                <h2 className="text-lg font-semibold text-white">Daily Morning AI Brief</h2>
                <Badge variant="blue">Updated Today</Badge>
              </div>
              <span className="text-xs text-zinc-500">{dailyBrief?.date}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* High Priority Leads */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> High Priority Leads
                </h3>
                {dailyBrief?.highPriorityLeads.map((lead) => (
                  <div key={lead.id} className="p-3 bg-zinc-950/60 rounded-lg border border-zinc-800/80">
                    <div className="flex items-center justify-between text-sm font-medium text-white">
                      <span>{lead.name}</span>
                      <Badge variant="emerald">{lead.score} PTS</Badge>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">{lead.reason}</p>
                  </div>
                ))}
              </div>

              {/* Deals at Risk */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Deals at Risk
                </h3>
                {dailyBrief?.dealsAtRisk.map((deal) => (
                  <div key={deal.id} className="p-3 bg-zinc-950/60 rounded-lg border border-zinc-800/80">
                    <div className="flex items-center justify-between text-sm font-medium text-white">
                      <span>{deal.title}</span>
                      <span className="text-xs font-bold text-rose-400">${(deal.value / 1000000).toFixed(1)}M</span>
                    </div>
                    <p className="text-xs text-rose-400/90 mt-1">{deal.riskFactor}</p>
                  </div>
                ))}
              </div>

              {/* Suggested Copilot Actions */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Suggested AI Actions
                </h3>
                <div className="space-y-2">
                  {dailyBrief?.suggestedActions.map((action, idx) => (
                    <div key={idx} className="p-2.5 bg-zinc-950/60 rounded-lg border border-zinc-800/80 text-xs text-zinc-300 flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Deal Health Predictor Grid */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" /> Deal Health Predictions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dealHealthList.map((dh) => (
                <Card key={dh.dealId} className="p-5 bg-zinc-900/60 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white">{dh.dealTitle}</h3>
                    <Badge variant={dh.healthGrade === "A" ? "emerald" : dh.healthGrade === "B" ? "blue" : "rose"}>
                      Grade {dh.healthGrade} ({dh.closingProbability}%)
                    </Badge>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <p className="text-zinc-400"><strong className="text-zinc-300">Next Action:</strong> {dh.recommendedNextAction}</p>
                    {dh.riskIndicators.length > 0 && (
                      <p className="text-rose-400"><strong className="text-rose-300">Risks:</strong> {dh.riskIndicators.join(", ")}</p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* AI Assistance Action Tools */}
          <Card className="p-6 bg-zinc-900/60 border border-zinc-800 space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" /> Instant Copilot Tools
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" size="sm" onClick={handleGenerateSummary}>
                <Sparkles className="w-4 h-4 mr-2 text-amber-400" /> Generate Lead Summary
              </Button>
              <Button variant="outline" size="sm" onClick={handleDraftEmail}>
                <Mail className="w-4 h-4 mr-2 text-blue-400" /> Draft AI Email
              </Button>
              <Button variant="outline" size="sm" onClick={handleDraftWhatsApp}>
                <MessageSquare className="w-4 h-4 mr-2 text-emerald-400" /> Draft AI WhatsApp
              </Button>
            </div>

            {activeSummary && (
              <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 space-y-3 animate-in fade-in">
                <h3 className="text-sm font-semibold text-white">{activeSummary.summary}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-semibold text-emerald-400">Opportunities:</span>
                    <ul className="list-disc list-inside text-zinc-400 mt-1">
                      {activeSummary.opportunities.map((o, idx) => <li key={idx}>{o}</li>)}
                    </ul>
                  </div>
                  <div>
                    <span className="font-semibold text-rose-400">Risks:</span>
                    <ul className="list-disc list-inside text-zinc-400 mt-1">
                      {activeSummary.risks.map((r, idx) => <li key={idx}>{r}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      ) : (
        /* Interactive Chat Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-3">
            <CopilotSidebar
              conversations={conversations}
              activeId={activeConvId}
              onSelectConversation={(id) => setActiveConvId(id)}
              onNewConversation={() => {
                const newId = `conv-${Date.now()}`;
                setConversations((prev) => [{ id: newId, title: "New AI Session", updatedAt: new Date().toISOString() }, ...prev]);
                setActiveConvId(newId);
                handleClear();
              }}
            />
          </div>
          <div className="lg:col-span-6">
            <CopilotChat
              messages={messages}
              provider="ANTHROPIC"
              model="claude-3-5-sonnet"
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
              onClear={handleClear}
            />
          </div>
          <div className="lg:col-span-3">
            <CopilotContextPanel />
          </div>
        </div>
      )}
    </div>
  );
}
