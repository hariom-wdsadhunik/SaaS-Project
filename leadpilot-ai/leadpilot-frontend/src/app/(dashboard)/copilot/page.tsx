"use client";

import * as React from "react";
import { CopilotSidebar } from "@/components/ai/copilot-sidebar";
import { CopilotChat } from "@/components/ai/copilot-chat";
import { CopilotContextPanel } from "@/components/ai/copilot-context-panel";
import { CopilotMessageItem } from "@/components/ai/copilot-message";
import { AIOrchestrator } from "@/domain/ai/orchestration/AIOrchestrator";
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
      content: "Hello! I am LeadPilot AI Copilot. Ask me to qualify leads, draft WhatsApp/Emails, or recommend deal strategies.",
      provider: "ANTHROPIC",
      model: "claude-3-5-sonnet",
      tokensUsed: 42,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [isLoading, setIsLoading] = React.useState(false);

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

  const handleNewConversation = () => {
    const newId = `conv-${Date.now()}`;
    setConversations((prev) => [{ id: newId, title: "New AI Session", updatedAt: new Date().toISOString() }, ...prev]);
    setActiveConvId(newId);
    handleClear();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Title */}
      <div className="border-b border-zinc-800/80 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-white">AI Copilot Workspace</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Enterprise multi-provider AI assistant for lead scoring, draft generation &amp; automated deal strategies
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar */}
        <div className="lg:col-span-3 h-full">
          <CopilotSidebar
            conversations={conversations}
            activeId={activeConvId}
            onSelectConversation={(id) => setActiveConvId(id)}
            onNewConversation={handleNewConversation}
          />
        </div>

        {/* Center Chat View */}
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

        {/* Right Context Panel */}
        <div className="lg:col-span-3">
          <CopilotContextPanel />
        </div>
      </div>
    </div>
  );
}
