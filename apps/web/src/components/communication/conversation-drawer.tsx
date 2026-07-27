import * as React from "react";
import { ConversationEntity } from "@/domain/communication/types";
import { ConversationDrawerHeader } from "./conversation-drawer-header";
import { User, Paperclip, Clock, History } from "lucide-react";
import { formatDate } from "@/utils/formatters";

interface ConversationDrawerProps {
  conversation: ConversationEntity | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ConversationDrawer({
  conversation,
  isOpen,
  onClose,
}: ConversationDrawerProps) {
  const [activeTab, setActiveTab] = React.useState<"participants" | "attachments" | "history">("participants");

  if (!isOpen || !conversation) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md lg:max-w-lg xl:max-w-[40%] bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col">
          {/* Header */}
          <ConversationDrawerHeader conversation={conversation} onClose={onClose} />

          {/* Tabs */}
          <div className="flex border-b border-zinc-800 bg-zinc-900/40 px-6 font-mono text-xs">
            <button
              onClick={() => setActiveTab("participants")}
              className={`py-3 px-3 border-b-2 font-medium transition-colors ${
                activeTab === "participants"
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Participants
            </button>
            <button
              onClick={() => setActiveTab("attachments")}
              className={`py-3 px-3 border-b-2 font-medium transition-colors ${
                activeTab === "attachments"
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Attachments
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`py-3 px-3 border-b-2 font-medium transition-colors ${
                activeTab === "history"
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Timeline History
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-zinc-300">
            {activeTab === "participants" && (
              <div className="space-y-3">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-bold text-white">{conversation.customerName}</p>
                      <p className="text-[11px] text-zinc-400 font-mono">External Customer</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-bold text-white">{conversation.assignedAgentName}</p>
                      <p className="text-[11px] text-zinc-400 font-mono">Assigned Broker Agent</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "attachments" && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-center space-y-2">
                <Paperclip className="h-6 w-6 text-zinc-500 mx-auto" />
                <p className="text-xs text-zinc-400 font-mono">No document attachments uploaded yet in this thread.</p>
              </div>
            )}

            {activeTab === "history" && (
              <div className="space-y-3 font-mono text-[11px]">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
                  <Clock className="h-4 w-4 text-indigo-400 mt-0.5" />
                  <div>
                    <p className="text-zinc-200 font-semibold">Conversation Initiated</p>
                    <p className="text-zinc-500 text-[10px]">{formatDate(conversation.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
                  <History className="h-4 w-4 text-emerald-400 mt-0.5" />
                  <div>
                    <p className="text-zinc-200 font-semibold">Last Message Exchanged</p>
                    <p className="text-zinc-500 text-[10px]">{formatDate(conversation.lastMessageAt)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
