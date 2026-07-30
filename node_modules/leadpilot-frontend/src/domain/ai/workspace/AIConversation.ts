import { AIMessage, EntityReference } from "./types";

export class AIConversation {
  public id: string;
  public organizationId: string;
  public userId: string;
  public messages: AIMessage[];
  public activeEntities: EntityReference[];
  public createdAt: string;
  public updatedAt: string;

  constructor(id: string, organizationId: string, userId: string) {
    const now = new Date().toISOString();
    this.id = id;
    this.organizationId = organizationId;
    this.userId = userId;
    this.messages = [];
    this.activeEntities = [];
    this.createdAt = now;
    this.updatedAt = now;
  }

  public addMessage(sender: "USER" | "ASSISTANT" | "SYSTEM", content: string, referencedEntities?: EntityReference[]): AIMessage {
    const msg: AIMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      sender,
      content,
      referencedEntities,
      timestamp: new Date().toISOString(),
    };

    this.messages.push(msg);
    if (referencedEntities) {
      this.activeEntities = [...this.activeEntities, ...referencedEntities];
    }
    this.updatedAt = new Date().toISOString();
    return msg;
  }
}
