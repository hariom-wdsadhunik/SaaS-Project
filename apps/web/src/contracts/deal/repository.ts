import { DealEntity, DealFilterState } from "@/domain/deal/types";
import { DealFormInput } from "@/lib/validations/deal-form";

export interface DealRepository {
  getDeals(filters?: Partial<DealFilterState>): Promise<DealEntity[]>;
  getDealById(id: string): Promise<DealEntity | null>;
  createDeal(input: DealFormInput): Promise<DealEntity>;
  updateDeal(id: string, input: DealFormInput): Promise<DealEntity>;
  deleteDeal(id: string): Promise<boolean>;
}
