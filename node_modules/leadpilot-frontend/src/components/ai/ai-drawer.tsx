"use client";

import * as React from "react";
import { Sparkles, X, Send, Bot, ArrowRight } from "lucide-react";
import { useUIStore } from "@/store/use-ui-store";

export function AIDrawer() {
  const { isAIDrawerOpen, setAIDrawerOpen } = useUIStore();
  const [input, setInput] = React.useState("");

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "j") {
        e.preventDefault();
        setAIDrawerOpen(!isAIDrawerOpen);
      }
      if (e.key === "Escape" && isAIDrawerOpen) {
        setAIDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAIDrawerOpen, setAIDrawerOpen]);

  if (!isAIDrawerOpen) return null;

  const samplePrompts = [
    "Find 3-bed properties under $1.5M matching Lead John Doe",
    "Draft a WhatsApp follow-up sequence for Deal #204",
    "Summarize high-priority leads needing response today",
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-zinc-800 bg-zinc-950 shadow-2xl animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-zinc-800 px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold text-zinc-100">LeadPilot AI Copilot</span>
        </div>
        <button
          onClick={() => setAIDrawerOpen(false)}
          className="rounded-md p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Body / Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex items-start gap-3 rounded-xl border border-violet-500/20 bg-violet-500/10 p-3.5">
          <Bot className="h-5 w-5 text-violet-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-violet-200">
            <p className="font-semibold text-violet-300">Welcome to LeadPilot AI Assistant!</p>
            <p>I can analyze lead propensity scores, auto-generate WhatsApp drip sequences, and match real estate inventory in real-time.</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-zinc-400">Suggested Prompts:</p>
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => setInput(prompt)}
              className="flex w-full items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/60 p-2.5 text-xs text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors text-left group"
            >
              <span>{prompt}</span>
              <ArrowRight className="h-3.5 w-3.5 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Footer Prompt Bar */}
      <div className="border-t border-zinc-800 p-3 bg-zinc-900/80">
        <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 focus-within:border-violet-500 transition-colors">
          <input
            type="text"
            placeholder="Ask AI anything... (Shift+Enter for line)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-transparent text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
          />
          <button className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-600 text-white hover:bg-violet-500 transition-colors shrink-0">
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
