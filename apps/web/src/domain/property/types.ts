export type PropertyStatus = "AVAILABLE" | "RESERVED" | "SOLD" | "OFF_MARKET";
export type PropertyType = "PENTHOUSE" | "VILLA" | "APARTMENT" | "COMMERCIAL" | "DUPLEX" | "TOWNHOUSE";

export interface PropertyEntity {
  id: string;
  mlsId: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  propertyType: PropertyType;
  status: PropertyStatus;
  coverImageUrl: string;
  galleryImages?: string[];
  assignedAgentName: string;
  agentAvatarUrl?: string;
  yearBuilt: number;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFilterState {
  search: string;
  propertyType: string;
  status: string;
  city: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  assignedAgent: string;
}
