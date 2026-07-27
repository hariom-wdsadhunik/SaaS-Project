export interface TourStep {
  id: string;
  target: string;
  title: string;
  description: string;
}

export class ProductTourService {
  private static tours: Record<string, TourStep[]> = {
    DASHBOARD: [
      { id: "s1", target: "#w-rev", title: "Revenue Metrics", description: "Track real-time win rates and average deal values." },
      { id: "s2", target: "#w-pipe", title: "Pipeline Velocity", description: "Monitor daily pipeline velocity growth." },
    ],
    LEADS: [
      { id: "s1", target: "#lead-table", title: "Lead Queue", description: "View AI propensity score rankings for high value leads." },
    ],
    DEALS: [
      { id: "s1", target: "#kanban-board", title: "Deal Pipeline", description: "Drag and drop deals across pipeline stages." },
    ],
    CALENDAR: [
      { id: "s1", target: "#calendar-view", title: "Appointment Calendar", description: "Schedule client property walkthroughs." },
    ],
    DOCUMENTS: [
      { id: "s1", target: "#doc-repo", title: "Document Repository", description: "Upload contracts with SHA-256 integrity and AI OCR processing." },
    ],
    COMMUNICATION: [
      { id: "s1", target: "#omni-chat", title: "Omnichannel Hub", description: "Send WhatsApp, Email, and SMS messages directly." },
    ],
    ANALYTICS: [
      { id: "s1", target: "#kpi-grid", title: "KPI Engine", description: "Review 11 core KPIs and 30-day predictive forecasts." },
    ],
    AI_WORKSPACE: [
      { id: "s1", target: "#ai-chat", title: "AI Copilot Workspace", description: "Ask complex multi-domain queries with citation tracking." },
    ],
  };

  public static getTourSteps(moduleName: string): TourStep[] {
    return this.tours[moduleName.toUpperCase()] || [];
  }
}
