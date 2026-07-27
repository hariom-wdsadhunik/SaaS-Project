export interface KnowledgeDocument {
  id: string;
  title: string;
  category: "POLICY" | "PLAYBOOK" | "FAQ";
  snippet: string;
}

export const KnowledgeMemory = {
  getKnowledgeSnippets(): KnowledgeDocument[] {
    return [
      {
        id: "doc-101",
        title: "Luxury Real Estate Commission Schedule",
        category: "POLICY",
        snippet: "Standard brokerage commission is 5% split equally between buyer and listing broker.",
      },
      {
        id: "doc-102",
        title: "High-Intent VIP Client Playbook",
        category: "PLAYBOOK",
        snippet: "Respond to leads over $2M budget within 15 minutes via preferred channel (WhatsApp or Phone).",
      },
    ];
  },
};
