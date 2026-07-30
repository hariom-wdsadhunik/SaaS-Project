import { ConversationEntity } from "@/domain/communication/types";
import { ApiResponse } from "../shared/api-response.dto";

export type ConversationResponseDto = ApiResponse<ConversationEntity>;
export type ConversationListResponseDto = ApiResponse<ConversationEntity[]>;
