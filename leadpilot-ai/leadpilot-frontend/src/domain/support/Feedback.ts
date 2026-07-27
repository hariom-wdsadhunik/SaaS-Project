export type FeedbackType = "feature_request" | "bug_report" | "general_feedback" | "ui_rating";

export interface Feedback {
  id: string;
  userId: string;
  organizationId: string;
  type: FeedbackType;
  rating?: number; // 1 to 5
  message: string;
  pageUrl: string;
  createdAt: Date;
}
