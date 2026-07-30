export type EntityType =
  | "LEAD"
  | "CONTACT"
  | "DEAL"
  | "TASK"
  | "APPOINTMENT"
  | "COMMUNICATION"
  | "DOCUMENT"
  | "ANALYTICS";

export interface EntityReference {
  id: string;
  type: EntityType;
  title: string;
  url?: string;
  metadata?: Record<string, unknown>;
}

export interface AIMessage {
  id: string;
  sender: "USER" | "ASSISTANT" | "SYSTEM";
  content: string;
  referencedEntities?: EntityReference[];
  structuredPayload?: Record<string, unknown>;
  timestamp: string;
}

export interface AIContext {
  organizationId: string;
  userId: string;
  userRole: string;
  activeEntity?: EntityReference;
  relatedEntities: EntityReference[];
  recentActivitySummary: string;
}

export interface FormattedAIResponse {
  message: string;
  citations: EntityReference[];
  suggestedActions?: { label: string; actionKey: string; payload?: Record<string, unknown> }[];
  widgetPayload?: Record<string, unknown>;
}
