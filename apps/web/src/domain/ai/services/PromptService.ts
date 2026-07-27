import { PromptTemplate } from "../types";

export const defaultTemplates: PromptTemplate[] = [
  {
    id: "prompt-lead-score",
    name: "AI Lead Score & Qualification",
    description: "Evaluates buyer budget, timeline, and intent signals to assign a qualification score.",
    systemPrompt: "You are LeadPilot AI Lead Qualification Architect.",
    userPromptTemplate: "Evaluate lead: {leadName}, Budget: {budget}, Intent: {intent}.",
    variables: ["leadName", "budget", "intent"],
  },
  {
    id: "prompt-property-match",
    name: "AI Property Recommendation",
    description: "Matches buyer preferences against property inventory.",
    systemPrompt: "You are LeadPilot AI Property Matching Engine.",
    userPromptTemplate: "Match properties for buyer {buyerName} looking for {criteria}.",
    variables: ["buyerName", "criteria"],
  },
];

export const PromptService = {
  getTemplates(): PromptTemplate[] {
    return defaultTemplates;
  },

  renderPrompt(template: PromptTemplate, values: Record<string, string>): string {
    let rendered = template.userPromptTemplate;
    Object.entries(values).forEach(([key, val]) => {
      rendered = rendered.replace(new RegExp(`\\{${key}\\}`, "g"), val);
    });
    return rendered;
  },
};
