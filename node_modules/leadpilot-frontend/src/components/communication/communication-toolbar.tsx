import * as React from "react";
import { MessageSquarePlus, RefreshCw, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CommunicationToolbarProps {
  onRefresh: () => void;
  onNewConversation?: () => void;
  isRefreshing?: boolean;
}

export function CommunicationToolbar({
  onRefresh,
  onNewConversation,
  isRefreshing = false,
}: CommunicationToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-zinc-300 font-mono flex items-center gap-1.5">
          <Filter className="h-3.5 w-3.5 text-indigo-400" />
          <span>Active Omnichannel Inboxes</span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={onRefresh} isLoading={isRefreshing} className="h-8 text-xs gap-1.5">
          <RefreshCw className="h-3.5 w-3.5 text-zinc-400" />
          <span>Refresh</span>
        </Button>
        <Button size="sm" variant="default" onClick={onNewConversation} className="h-8 text-xs gap-1.5 shadow-sm">
          <MessageSquarePlus className="h-3.5 w-3.5" />
          <span>New Message</span>
        </Button>
      </div>
    </div>
  );
}
