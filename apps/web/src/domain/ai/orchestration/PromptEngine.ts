import { PromptService } from "../services/PromptService";

export const PromptEngine = {
  assemblePrompt(templateId: string, variables: Record<string, string>, contextText?: string): string {
    const templates = PromptService.getTemplates();
    const template = templates.find((t) => t.id === templateId) || templates[0];
    const rendered = PromptService.renderPrompt(template, variables);

    return contextText ? `${contextText}\n\n${rendered}` : rendered;
  },
};
