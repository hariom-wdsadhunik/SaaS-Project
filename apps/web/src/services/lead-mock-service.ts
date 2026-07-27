import { LeadFormInput } from "@/lib/validations/lead-form";
import { LeadItem } from "@/components/leads/lead-feedback";

// Shared mock database for duplicate check simulation
const existingLeadsDatabase: Array<{ email?: string; phone?: string }> = [
  { email: "john.doe@example.com", phone: "+1 (555) 234-5678" },
  { email: "sarah.jenkins@agency.io", phone: "+1 (555) 876-5432" },
];

export const leadMockService = {
  async createLead(input: LeadFormInput): Promise<LeadItem> {
    // Simulated network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Duplicate Email Check
    if (
      input.email &&
      existingLeadsDatabase.some(
        (l) => l.email?.toLowerCase() === input.email?.toLowerCase()
      )
    ) {
      throw new Error(`A lead with email ${input.email} already exists.`);
    }

    // Duplicate Phone Check
    if (
      input.phone &&
      existingLeadsDatabase.some(
        (l) => l.phone?.replace(/\D/g, "") === input.phone?.replace(/\D/g, "")
      )
    ) {
      throw new Error(`A lead with phone number ${input.phone} already exists.`);
    }

    // Register new contact to mock database
    existingLeadsDatabase.push({ email: input.email, phone: input.phone });

    const newLead: LeadItem = {
      id: `ld-${Math.floor(100 + Math.random() * 900)}`,
      fullName: input.fullName,
      email: input.email || "",
      phone: input.phone || "",
      source: input.source,
      status: input.status,
      aiPropensityScore: 50, // Initial default score
      budgetMin: input.budgetMin || 0,
      budgetMax: input.budgetMax || 0,
      assignedBrokerName: input.assignedBrokerName || "Unassigned",
      createdAt: new Date().toISOString(),
    };

    return newLead;
  },

  async updateLead(id: string, input: LeadFormInput): Promise<LeadItem> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const updatedLead: LeadItem = {
      id,
      fullName: input.fullName,
      email: input.email || "",
      phone: input.phone || "",
      source: input.source,
      status: input.status,
      aiPropensityScore: 75,
      budgetMin: input.budgetMin || 0,
      budgetMax: input.budgetMax || 0,
      assignedBrokerName: input.assignedBrokerName || "Unassigned",
      createdAt: new Date().toISOString(),
    };

    return updatedLead;
  },
};
