export interface CommunicationTemplate {
  id: string;
  name: string;
  channel: string;
  content: string;
}

export const TemplateService = {
  getTemplates(): CommunicationTemplate[] {
    return [
      {
        id: "tmpl-1",
        name: "Property Viewing Confirmation",
        channel: "WHATSAPP",
        content: "Hi {customerName}, confirming our property viewing appointment tomorrow for {propertyName}.",
      },
      {
        id: "tmpl-2",
        name: "Contract Follow-up",
        channel: "EMAIL",
        content: "Dear {customerName}, please review the attached contract document for {propertyName}.",
      },
    ];
  },
};
