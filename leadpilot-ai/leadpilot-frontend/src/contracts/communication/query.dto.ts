import { CommunicationFilterState } from "@/domain/communication/types";

export interface CommunicationQueryDto extends Partial<CommunicationFilterState> {
  page?: number;
  pageSize?: number;
}
