import { AIConversation } from "./AIConversation";

export class ConversationMemory {
  private static memoryStore: Map<string, AIConversation> = new Map();

  public static saveConversation(conversation: AIConversation): void {
    this.memoryStore.set(conversation.id, conversation);
  }

  public static getConversation(conversationId: string): AIConversation | null {
    return this.memoryStore.get(conversationId) || null;
  }

  public static clearMemory(): void {
    this.memoryStore.clear();
  }
}
