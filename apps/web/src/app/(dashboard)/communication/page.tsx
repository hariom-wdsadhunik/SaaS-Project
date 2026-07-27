"use client";

import * as React from "react";
import { CommunicationFilters } from "@/components/communication/communication-filters";
import { CommunicationToolbar } from "@/components/communication/communication-toolbar";
import { ConversationList } from "@/components/communication/conversation-list";
import { ConversationThread } from "@/components/communication/conversation-thread";
import { ConversationDrawer } from "@/components/communication/conversation-drawer";
import { EntityEmptyState } from "@/platform/ui/entity-feedback";
import { CommunicationFacade } from "@/domain/communication/CommunicationFacade";
import { ConversationEntity, MessageEntity, CommunicationFilterState } from "@/domain/communication/types";
import { toast } from "sonner";

const initialFilterState: CommunicationFilterState = {
  search: "",
  channel: "",
  status: "",
  assignedAgent: "",
  isArchived: false,
  isPinned: false,
};

export default function CommunicationPage() {
  const [conversations, setConversations] = React.useState<ConversationEntity[]>([]);
  const [selectedConversation, setSelectedConversation] = React.useState<ConversationEntity | null>(null);
  const [messages, setMessages] = React.useState<MessageEntity[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [filters, setFilters] = React.useState<CommunicationFilterState>(initialFilterState);

  React.useEffect(() => {
    let isMounted = true;
    CommunicationFacade.getConversations(filters)
      .then((data) => {
        if (isMounted) {
          setConversations(data);
          if (data.length > 0 && !selectedConversation) {
            setSelectedConversation(data[0]);
            setMessages([
              {
                id: "msg-1",
                conversationId: data[0].id,
                sender: data[0].customerName || "Marcus Vance",
                receiver: "Alex Morgan",
                direction: "INBOUND",
                senderId: "customer-1",
                senderName: data[0].customerName || "Marcus Vance",
                content: data[0].lastMessage || "Hello, inquiring about the property listing.",
                channel: data[0].channel,
                status: "READ",
                provider: "SYSTEM",
                sentAt: data[0].lastMessageAt,
                createdAt: data[0].lastMessageAt,
              },
            ]);
          }
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          toast.error("Failed to load conversations.");
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [filters, selectedConversation]);

  const handleFilterChange = (newFilters: Partial<CommunicationFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilterState);
    toast.info("Filters reset");
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    toast.info("Refreshing inbox...");
    try {
      const freshData = await CommunicationFacade.getConversations(filters);
      setConversations(freshData);
      toast.success("Inbox updated");
    } catch {
      toast.error("Failed to refresh inbox.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedConversation) return;
    setIsSending(true);
    try {
      const newMsg = await CommunicationFacade.sendMessage({
        conversationId: selectedConversation.id,
        recipient: "+14155552671",
        content,
      });
      setMessages((prev) => [...prev, newMsg]);
      toast.success("Message dispatched");
    } catch {
      toast.error("Failed to send message.");
    } finally {
      setIsSending(false);
    }
  };

  const activeFilterCount = Object.values(filters).filter((v) => v !== "" && v !== false).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Omnichannel Communication Hub</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Unified inbox across WhatsApp, Email, SMS &amp; Internal Broker Notes
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <CommunicationFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        activeFilterCount={activeFilterCount}
      />

      {/* Toolbar */}
      <CommunicationToolbar
        onRefresh={handleRefresh}
        onNewConversation={() => toast.info("New Message Dialog Triggered")}
        isRefreshing={isRefreshing}
      />

      {/* Main Workspace Layout */}
      {isLoading ? (
        <div className="h-96 rounded-2xl border border-zinc-800 bg-zinc-950/60 animate-pulse flex items-center justify-center text-xs text-zinc-500 font-mono">
          Loading conversation threads...
        </div>
      ) : conversations.length === 0 ? (
        <EntityEmptyState
          title="No Conversations Found"
          description="No active conversation threads match your filter query."
          onResetFilters={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Sidebar Conversations List */}
          <div className="lg:col-span-4">
            <ConversationList
              conversations={conversations}
              selectedConversationId={selectedConversation?.id}
              onSelectConversation={(conv) => {
                setSelectedConversation(conv);
                setMessages([
                  {
                    id: `msg-${conv.id}`,
                    conversationId: conv.id,
                    sender: conv.customerName || "Marcus Vance",
                    receiver: "Alex Morgan",
                    direction: "INBOUND",
                    senderId: "customer-1",
                    senderName: conv.customerName,
                    content: conv.lastMessage || "Hello, checking in on my inquiry.",
                    channel: conv.channel,
                    status: "READ",
                    provider: "SYSTEM",
                    sentAt: conv.lastMessageAt,
                    createdAt: conv.lastMessageAt,
                  },
                ]);
              }}
            />
          </div>

          {/* Active Conversation Thread */}
          <div className="lg:col-span-8">
            <ConversationThread
              conversation={selectedConversation}
              messages={messages}
              onSendMessage={handleSendMessage}
              isSending={isSending}
            />
          </div>
        </div>
      )}

      {/* Drawer */}
      <ConversationDrawer
        conversation={selectedConversation}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
