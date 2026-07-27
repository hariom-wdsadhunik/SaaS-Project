export interface LeadSummary {
  leadId: string;
  summary: string;
  keyFacts: string[];
  risks: string[];
  opportunities: string[];
  generatedAt: string;
}

export interface EmailAssistantRequest {
  action: "generate_followup" | "rewrite" | "change_tone" | "summarize_thread";
  recipientName?: string;
  context?: string;
  tone?: "professional" | "persuasive" | "concise" | "friendly";
  originalMessage?: string;
}

export interface EmailAssistantResult {
  subject?: string;
  body: string;
  summary?: string;
  actionTaken: string;
}

export interface WhatsAppAssistantRequest {
  action: "draft_reply" | "generate_followup" | "summarize_chat";
  contactName?: string;
  lastMessage?: string;
  chatHistory?: string[];
}

export interface WhatsAppAssistantResult {
  suggestedReply: string;
  summary?: string;
  followupPrompt?: string;
}

export interface MeetingPrep {
  leadId: string;
  leadName: string;
  leadOverview: string;
  timelineHighlights: string[];
  previousInteractionsCount: number;
  openTasks: string[];
  recommendedTalkingPoints: string[];
  generatedAt: string;
}

export interface DailyBrief {
  userId: string;
  date: string;
  highPriorityLeads: { id: string; name: string; score: number; reason: string }[];
  dealsAtRisk: { id: string; title: string; value: number; riskFactor: string }[];
  tasksDueToday: { id: string; title: string; priority: string }[];
  suggestedActions: string[];
}

export interface DealHealthPrediction {
  dealId: string;
  dealTitle: string;
  closingProbability: number; // 0 - 100
  missingInformation: string[];
  riskIndicators: string[];
  recommendedNextAction: string;
  healthGrade: "A" | "B" | "C" | "D" | "F";
}
