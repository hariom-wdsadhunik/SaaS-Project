import * as React from "react";
import { Send, Sparkles, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CopilotComposerProps {
  onSendMessage: (prompt: string) => void;
  isLoading?: boolean;
}

export function CopilotComposer({ onSendMessage, isLoading = false }: CopilotComposerProps) {
  const [prompt, setPrompt] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onSendMessage(prompt.trim());
    setPrompt("");
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-zinc-800 bg-zinc-950 p-4 space-y-3">
      <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/60 focus-within:border-indigo-500/80 transition-colors p-3">
        <textarea
          rows={2}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask LeadPilot AI Copilot (e.g. 'Analyze lead budget', 'Draft WhatsApp')..."
          className="w-full bg-transparent text-xs text-white placeholder:text-zinc-500 focus:outline-none resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />

        <div className="flex items-center justify-between border-t border-zinc-800/60 pt-2.5 mt-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="Attach CRM Entity Context"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-indigo-400" />
              <span>Press Enter to send</span>
            </span>
          </div>

          <Button size="sm" type="submit" isLoading={isLoading} disabled={!prompt.trim() || isLoading} className="h-8 text-xs gap-1.5">
            <span>Ask Copilot</span>
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </form>
  );
}
