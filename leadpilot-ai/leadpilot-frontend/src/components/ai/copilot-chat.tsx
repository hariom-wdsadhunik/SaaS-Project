import * as React from "react";
import { CopilotHeader } from "./copilot-header";
import { CopilotSuggestions } from "./copilot-suggestions";
import { CopilotMessage, CopilotMessageItem } from "./copilot-message";
import { CopilotComposer } from "./copilot-composer";

interface CopilotChatProps {
  messages: CopilotMessageItem[];
  provider: string;
  model: string;
  isLoading: boolean;
  onSendMessage: (prompt: string) => void;
  onClear: () => void;
}

export function CopilotChat({
  messages,
  provider,
  model,
  isLoading,
  onSendMessage,
  onClear,
}: CopilotChatProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] rounded-2xl border border-zinc-800 bg-zinc-950/80 shadow-2xl overflow-hidden">
      {/* Header */}
      <CopilotHeader provider={provider} model={model} onClear={onClear} />

      {/* Main Messages & Suggestions Container */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length <= 1 && (
          <CopilotSuggestions onSelectSuggestion={onSendMessage} />
        )}

        {messages.map((msg) => (
          <CopilotMessage key={msg.id} message={msg} />
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 w-fit text-xs text-indigo-400 font-mono animate-pulse">
            <span>AI Copilot is processing context &amp; generating response...</span>
          </div>
        )}
      </div>

      {/* Composer */}
      <CopilotComposer onSendMessage={onSendMessage} isLoading={isLoading} />
    </div>
  );
}
