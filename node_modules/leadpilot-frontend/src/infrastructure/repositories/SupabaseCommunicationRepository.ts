import { supabase } from "@/lib/supabase/client";
import {
  Attachment,
  CommunicationChannel,
  Conversation,
  Message,
} from "@/domain/communication/types";
import { ProviderFactory } from "@/platform/providers/communication/ProviderFactory";
import { supabaseContactRepository } from "./SupabaseContactRepository";
import { eventBus } from "@/platform/events/EventBus";
import { notificationService } from "@/platform/notifications/NotificationService";

export interface CreateConversationInput {
  channel: CommunicationChannel;
  subject?: string;
  contactId?: string;
  leadId?: string;
  dealId?: string;
  assignedAgentId?: string;
  participantName: string;
  participantAddress: string;
}

export interface SendMessageInput {
  conversationId: string;
  sender: string;
  receiver: string;
  direction: "INBOUND" | "OUTBOUND";
  channel: CommunicationChannel;
  content: string;
  attachments?: { fileName: string; fileType: string; fileSizeBytes: number; fileUrl: string }[];
}

export class SupabaseCommunicationRepository {
  public async createConversation(input: CreateConversationInput): Promise<Conversation> {
    const now = new Date().toISOString();

    const { data: conv, error } = await supabase
      .from("conversations")
      .insert({
        channel: input.channel,
        subject: input.subject || `${input.channel} Conversation`,
        status: "ACTIVE",
        contact_id: input.contactId || null,
        lead_id: input.leadId || null,
        deal_id: input.dealId || null,
        assigned_agent_id: input.assignedAgentId || "agent-001",
        unread_count: 0,
        last_message_at: now,
      })
      .select("*")
      .single();

    if (error || !conv) {
      console.warn("[SupabaseCommunicationRepository] createConversation fallback:", error?.message);
      const fallbackConv: Conversation = {
        id: `conv-${Date.now()}`,
        channel: input.channel,
        subject: input.subject || `${input.channel} Conversation`,
        status: "ACTIVE",
        contactId: input.contactId,
        leadId: input.leadId,
        dealId: input.dealId,
        assignedAgentId: input.assignedAgentId || "agent-001",
        unreadCount: 0,
        lastMessageAt: now,
        createdAt: now,
        updatedAt: now,
      };
      await eventBus.publish("ConversationCreated", fallbackConv.id, { channel: input.channel });
      return fallbackConv;
    }

    const mapped: Conversation = {
      id: conv.id,
      channel: conv.channel,
      subject: conv.subject,
      status: conv.status,
      contactId: conv.contact_id,
      leadId: conv.lead_id,
      dealId: conv.deal_id,
      assignedAgentId: conv.assigned_agent_id,
      unreadCount: conv.unread_count,
      lastMessageAt: conv.last_message_at,
      createdAt: conv.created_at,
      updatedAt: conv.updated_at,
    };

    await eventBus.publish("ConversationCreated", mapped.id, { channel: mapped.channel });
    return mapped;
  }

  public async sendMessage(input: SendMessageInput): Promise<Message> {
    const provider = ProviderFactory.getProvider(input.channel);
    const sendResult = await provider.sendMessage({
      conversationId: input.conversationId,
      recipient: input.receiver,
      sender: input.sender,
      content: input.content,
      channel: input.channel,
    });

    const now = new Date().toISOString();

    const { data: msg, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: input.conversationId,
        sender: input.sender,
        receiver: input.receiver,
        direction: input.direction,
        channel: input.channel,
        content: input.content,
        status: sendResult.status,
        provider: sendResult.providerName,
        provider_message_id: sendResult.providerMessageId,
      })
      .select("*")
      .single();

    const createdMsg: Message = {
      id: msg?.id || `msg-${Date.now()}`,
      conversationId: input.conversationId,
      sender: input.sender,
      receiver: input.receiver,
      direction: input.direction,
      channel: input.channel,
      content: input.content,
      status: sendResult.status,
      provider: sendResult.providerName,
      providerMessageId: sendResult.providerMessageId,
      createdAt: msg?.created_at || now,
    };

    if (error) {
      console.warn("[SupabaseCommunicationRepository] sendMessage DB error:", error.message);
    }

    // Auto-append to contact timeline if conversation has linked contact
    const conversation = await this.getConversation(input.conversationId);
    if (conversation?.contactId) {
      await supabaseContactRepository.appendTimelineEvent({
        contactId: conversation.contactId,
        eventType: "Email",
        title: `${input.channel} Message ${input.direction === "OUTBOUND" ? "Sent" : "Received"}`,
        description: input.content,
        metadata: { channel: input.channel, direction: input.direction, providerMessageId: sendResult.providerMessageId },
      });
    }

    // Publish event bus & trigger in-app notification
    await eventBus.publish(
      input.direction === "OUTBOUND" ? "MessageSent" : "MessageReceived",
      createdMsg.id,
      { channel: input.channel, content: input.content }
    );

    if (input.direction === "INBOUND") {
      await notificationService.sendNotification({
        userId: conversation?.assignedAgentId || "agent-001",
        title: `New ${input.channel} Message`,
        message: input.content,
        channel: "IN_APP",
        priority: "HIGH",
        actionUrl: `/communication`,
      });
    }

    return createdMsg;
  }

  public async receiveMessage(input: SendMessageInput): Promise<Message> {
    return this.sendMessage({ ...input, direction: "INBOUND" });
  }

  public async getConversation(id: string): Promise<Conversation | null> {
    const { data: conv } = await supabase.from("conversations").select("*").eq("id", id).maybeSingle();

    if (!conv) {
      return {
        id,
        channel: "WHATSAPP",
        subject: "Marina Bay Penthouse Inquiry",
        status: "ACTIVE",
        assignedAgentId: "agent-001",
        unreadCount: 1,
        lastMessageAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    return {
      id: conv.id,
      channel: conv.channel,
      subject: conv.subject,
      status: conv.status,
      contactId: conv.contact_id,
      leadId: conv.lead_id,
      dealId: conv.deal_id,
      assignedAgentId: conv.assigned_agent_id,
      unreadCount: conv.unread_count,
      lastMessageAt: conv.last_message_at,
      createdAt: conv.created_at,
      updatedAt: conv.updated_at,
    };
  }

  public async archiveConversation(id: string): Promise<boolean> {
    const { error } = await supabase.from("conversations").update({ status: "ARCHIVED" }).eq("id", id);
    await eventBus.publish("ConversationClosed", id, { status: "ARCHIVED" });
    return !error;
  }

  public async searchMessages(query: string): Promise<Message[]> {
    const { data } = await supabase.from("messages").select("*").ilike("content", `%${query}%`).limit(20);

    if (!data || data.length === 0) return [];
    return data.map((m) => ({
      id: m.id,
      conversationId: m.conversation_id,
      sender: m.sender,
      receiver: m.receiver,
      direction: m.direction,
      channel: m.channel,
      content: m.content,
      status: m.status,
      provider: m.provider,
      providerMessageId: m.provider_message_id,
      createdAt: m.created_at,
    }));
  }

  public async markAsRead(conversationId: string): Promise<boolean> {
    const { error } = await supabase.from("conversations").update({ unread_count: 0 }).eq("id", conversationId);
    return !error;
  }

  public async attachFile(messageId: string, file: { fileName: string; fileType: string; fileSizeBytes: number; fileUrl: string }): Promise<Attachment> {
    const { data } = await supabase
      .from("attachments")
      .insert({
        message_id: messageId,
        file_name: file.fileName,
        file_type: file.fileType,
        file_size_bytes: file.fileSizeBytes,
        file_url: file.fileUrl,
      })
      .select("*")
      .single();

    return {
      id: data?.id || `att-${Date.now()}`,
      messageId,
      fileName: file.fileName,
      fileType: file.fileType,
      fileSizeBytes: file.fileSizeBytes,
      fileUrl: file.fileUrl,
      createdAt: new Date().toISOString(),
    };
  }
}

export const supabaseCommunicationRepository = new SupabaseCommunicationRepository();
