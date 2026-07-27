import * as React from "react";
import { Send, Paperclip, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface MessageComposerProps {
  onSendMessage: (content: string) => void;
  isSending?: boolean;
}

export function MessageComposer({ onSendMessage, isSending = false }: MessageComposerProps) {
  const [content, setContent] = React.useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSendMessage(content);
    setContent("");
  };

  return (
    <form onSubmit={handleSend} className="border-t border-zinc-800 bg-zinc-950 p-4 space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type your message or response..."
        rows={2}
        className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none resize-none"
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            type="button"
            onClick={() => toast.info("Template Picker Triggered")}
            className="h-8 text-xs gap-1.5 text-zinc-400 hover:text-white"
          >
            <FileCode className="h-3.5 w-3.5" />
            <span>Templates</span>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            type="button"
            onClick={() => toast.info("Attach File Triggered")}
            className="h-8 text-xs gap-1.5 text-zinc-400 hover:text-white"
          >
            <Paperclip className="h-3.5 w-3.5" />
            <span>Attach</span>
          </Button>
        </div>

        <Button size="sm" type="submit" isLoading={isSending} disabled={!content.trim()} className="gap-1.5">
          <span>Send</span>
          <Send className="h-3.5 w-3.5" />
        </Button>
      </div>
    </form>
  );
}
