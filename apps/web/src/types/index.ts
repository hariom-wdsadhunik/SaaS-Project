export type UserRole = "OWNER" | "ADMIN" | "BROKER_LEAD" | "SALES_EXECUTIVE";

export type LeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "NURTURING" | "LOST" | "CONVERTED";

export type DealStage =
  | "QUALIFIED_PROSPECT"
  | "VIEWING_SCHEDULED"
  | "OFFER_SUBMITTED"
  | "UNDER_CONTRACT"
  | "CLOSED_WON"
  | "CLOSED_LOST";

export interface Lead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  status: LeadStatus;
  aiPropensityScore: number; // 0 - 100
  budgetMin: number;
  budgetMax: number;
  preferredLocations: string[];
  assignedBrokerId?: string;
  assignedBrokerName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Deal {
  id: string;
  title: string;
  leadId: string;
  leadName: string;
  propertyId?: string;
  propertyTitle?: string;
  stage: DealStage;
  amount: number;
  expectedCloseDate: string;
  assignedBrokerId: string;
  createdAt: string;
}

export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  propertyType: "APARTMENT" | "VILLA" | "PENTHOUSE" | "TOWNHOUSE" | "LAND";
  images: string[];
  isAvailable: boolean;
}

export interface WhatsAppMessage {
  id: string;
  senderPhone: string;
  receiverPhone: string;
  content: string;
  isAIHandled: boolean;
  timestamp: string;
  status: "SENT" | "DELIVERED" | "READ" | "FAILED";
}
