import { PropertyEntity, PropertyFilterState } from "@/domain/property/types";
import { PropertyFormInput } from "@/lib/validations/property-form";

export interface PropertyRepository {
  getProperties(filters?: Partial<PropertyFilterState>): Promise<PropertyEntity[]>;
  getPropertyById(id: string): Promise<PropertyEntity | null>;
  createProperty(input: PropertyFormInput): Promise<PropertyEntity>;
  updateProperty(id: string, input: PropertyFormInput): Promise<PropertyEntity>;
  deleteProperties(ids: string[]): Promise<boolean>;
}
