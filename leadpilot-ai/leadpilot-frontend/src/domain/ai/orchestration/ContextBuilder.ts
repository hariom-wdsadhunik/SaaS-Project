export const ContextBuilder = {
  buildLeadContext(lead: { name: string; budget?: number; status?: string }): string {
    return `[CRM CONTEXT - LEAD] Name: ${lead.name}, Budget: $${lead.budget || 0}, Status: ${lead.status || "NEW"}`;
  },

  buildDealContext(deal: { title: string; value: number; stage: string }): string {
    return `[CRM CONTEXT - DEAL] Title: ${deal.title}, Value: $${deal.value}, Stage: ${deal.stage}`;
  },
};
