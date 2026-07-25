import { ConversationEntity, MessageEntity, CommunicationFilterState } from "../types";
import { platformAuditLogger } from "@/platform/audit";

export const initialConversationsDataset: ConversationEntity[] = [
  {
    id: "conv-101",
    title: "Marcus Vance - Marina Penthouse Inquiry",
    customerName: "Marcus Vance",
    channel: "WHATSAPP",
    status: "ACTIVE",
    unreadCount: 2,
    lastMessage: "Looking forward to the private walkthrough tomorrow at 10 AM.",
    lastMessageAt: "2026-07-25T11:45:00Z",
    isPinned: true,
    isArchived: false,
    isMuted: false,
    assignedAgentName: "Alex Morgan",
    createdAt: "2026-07-25T09:00:00Z",
    updatedAt: "2026-07-25T11:45:00Z",
  },
  {
    id: "conv-102",
    title: "Eleanor Sterling - Contract Closing Documentation",
    customerName: "Eleanor Sterling",
    channel: "EMAIL",
    status: "PENDING",
    unreadCount: 0,
    lastMessage: "Legal addendum sent for Beachfront Villa title transfer.",
    lastMessageAt: "2026-07-25T10:30:00Z",
    isPinned: false,
    isArchived: false,
    isMuted: false,
    assignedAgentName: "Sarah Jenkins",
    createdAt: "2026-07-25T08:00:00Z",
    updatedAt: "2026-07-25T10:30:00Z",
  },
];

export const communicationService = {
  async getConversations(filters?: Partial<CommunicationFilterState>): Promise<ConversationEntity[]> {
    await new Promise((res) => setTimeout(res, 150));

    platformAuditLogger.log({
      action: "UPDATE",
      entityType: "SYSTEM",
      entityIds: ["conversations-list"],
      payload: { filters },
      timestamp: new Date().toISOString(),
    });

    if (!filters) return initialConversationsDataset;

    return initialConversationsDataset.filter((conv) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchesTitle = conv.title.toLowerCase().includes(q);
        const matchesCustomer = conv.customerName.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCustomer) return false;
      }
      if (filters.channel && conv.channel !== filters.channel) return false;
      if (filters.status && conv.status !== filters.status) return false;
      if (filters.assignedAgent && conv.assignedAgentName !== filters.assignedAgent) return false;
      return true;
    });
  },

  async sendMessage(conversationId: string, content: string): Promise<MessageEntity> {
    await new Promise((res) => setTimeout(res, 200));

    const newMsg: MessageEntity = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: "agent-curr",
      senderName: "Alex Morgan",
      content,
      channel: "WHATSAPP",
      status: "SENT",
      sentAt: new Date().toISOString(),
    };

    platformAuditLogger.log({
      action: "CREATE",
      entityType: "SYSTEM",
      entityIds: [newMsg.id],
      payload: { conversationId, contentSnippet: content.slice(0, 30) },
      timestamp: new Date().toISOString(),
    });

    return newMsg;
  },
};
