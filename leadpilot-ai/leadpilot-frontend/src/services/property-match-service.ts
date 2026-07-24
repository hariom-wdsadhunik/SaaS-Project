import { PropertyEntity } from "@/domain/property/types";

export interface PropertyMatchResult {
  propertyId: string;
  matchScore: number;
  matchReasons: string[];
}

export const propertyMatchService = {
  async getLeadPropertyMatches(leadId: string, properties: PropertyEntity[]): Promise<PropertyMatchResult[]> {
    await new Promise((res) => setTimeout(res, 200));

    return properties.map((prop) => ({
      propertyId: prop.id,
      matchScore: Math.floor(75 + Math.random() * 23),
      matchReasons: [
        "Matches buyer budget range",
        "Preferred location preference",
        "Required bedroom configuration",
      ],
    }));
  },

  async getDealPropertyMatches(dealId: string, properties: PropertyEntity[]): Promise<PropertyMatchResult[]> {
    await new Promise((res) => setTimeout(res, 200));

    return properties.map((prop) => ({
      propertyId: prop.id,
      matchScore: Math.floor(80 + Math.random() * 18),
      matchReasons: [
        "Exact transaction valuation alignment",
        "Commercial / residential zoning fit",
      ],
    }));
  },
};
