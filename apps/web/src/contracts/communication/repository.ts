import { ConversationEntity, MessageEntity } from "@/domain/communication/types";
import { CommunicationQueryDto } from "./query.dto";

export interface CommunicationRepository {
  getConversations(query?: CommunicationQueryDto): Promise<ConversationEntity[]>;
  getConversationById(id: string): Promise<ConversationEntity | null>;
  sendMessage(conversationId: string, content: string): Promise<MessageEntity>;
  archiveConversation(id: string): Promise<boolean>;
  pinConversation(id: string): Promise<boolean>;
}
