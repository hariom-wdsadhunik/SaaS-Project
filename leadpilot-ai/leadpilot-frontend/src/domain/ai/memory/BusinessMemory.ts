export interface BusinessMemoryItem {
  entityType: "LEAD" | "DEAL" | "PROPERTY";
  entityId: string;
  keyFacts: string[];
}

export const BusinessMemory = {
  getBusinessMemory(entityId: string): BusinessMemoryItem {
    return {
      entityType: "LEAD",
      entityId,
      keyFacts: [
        "Marcus Vance - Budget: $5,000,000",
        "Target area: Downtown Penthouse or Waterfront Villa",
        "Prequalified by Mortgage Broker: YES",
      ],
    };
  },
};
