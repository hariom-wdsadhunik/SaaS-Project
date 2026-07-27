import { platformAuditLogger } from "@/platform/audit";

export interface ContactRelationshipNode {
  contactId: string;
  associatedLeadIds: string[];
  associatedDealIds: string[];
  associatedPropertyIds: string[];
  associatedDocumentIds: string[];
}

export const mockRelationshipGraph: Record<string, ContactRelationshipNode> = {
  "cnt-301": {
    contactId: "cnt-301",
    associatedLeadIds: ["lead-101"],
    associatedDealIds: ["deal-201"],
    associatedPropertyIds: ["prop-101"],
    associatedDocumentIds: ["doc-401", "doc-402"],
  },
  "cnt-302": {
    contactId: "cnt-302",
    associatedLeadIds: ["lead-102"],
    associatedDealIds: ["deal-202"],
    associatedPropertyIds: ["prop-102"],
    associatedDocumentIds: ["doc-403"],
  },
};

export const contactRelationshipService = {
  async getRelationships(contactId: string): Promise<ContactRelationshipNode> {
    await new Promise((res) => setTimeout(res, 150));
    return (
      mockRelationshipGraph[contactId] || {
        contactId,
        associatedLeadIds: [],
        associatedDealIds: [],
        associatedPropertyIds: [],
        associatedDocumentIds: [],
      }
    );
  },

  async linkEntity(
    contactId: string,
    targetType: "LEAD" | "DEAL" | "PROPERTY" | "DOCUMENT",
    targetId: string
  ): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 250));

    if (!mockRelationshipGraph[contactId]) {
      mockRelationshipGraph[contactId] = {
        contactId,
        associatedLeadIds: [],
        associatedDealIds: [],
        associatedPropertyIds: [],
        associatedDocumentIds: [],
      };
    }

    const node = mockRelationshipGraph[contactId];
    if (targetType === "LEAD" && !node.associatedLeadIds.includes(targetId)) {
      node.associatedLeadIds.push(targetId);
    } else if (targetType === "DEAL" && !node.associatedDealIds.includes(targetId)) {
      node.associatedDealIds.push(targetId);
    } else if (targetType === "PROPERTY" && !node.associatedPropertyIds.includes(targetId)) {
      node.associatedPropertyIds.push(targetId);
    } else if (targetType === "DOCUMENT" && !node.associatedDocumentIds.includes(targetId)) {
      node.associatedDocumentIds.push(targetId);
    }

    platformAuditLogger.log({
      action: "CREATE",
      entityType: "SYSTEM",
      entityIds: [contactId, targetId],
      payload: { targetType },
      timestamp: new Date().toISOString(),
    });

    return true;
  },
};
