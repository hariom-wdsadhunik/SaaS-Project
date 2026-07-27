export interface ArticleCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  content: string;
  helpfulCount: number;
  unhelpfulCount: number;
  publishedAt: Date;
}

export const SAMPLE_CATEGORIES: ArticleCategory[] = [
  { id: "cat_getting_started", name: "Getting Started", slug: "getting-started", icon: "BookOpen" },
  { id: "cat_ai_workspace", name: "AI Workspace", slug: "ai-workspace", icon: "Bot" },
  { id: "cat_workflows", name: "Workflow Automation", slug: "workflows", icon: "Zap" },
  { id: "cat_billing", name: "Billing & Subscriptions", slug: "billing", icon: "CreditCard" },
];

export const SAMPLE_ARTICLES: Article[] = [
  {
    id: "art_101",
    title: "How to Query the AI Copilot Workspace",
    slug: "query-ai-copilot",
    categoryId: "cat_ai_workspace",
    content: "Learn how to use multi-domain context synthesis across leads, deals, tasks, and documents.",
    helpfulCount: 42,
    unhelpfulCount: 1,
    publishedAt: new Date(),
  },
  {
    id: "art_102",
    title: "Setting Up Event-Driven Workflows",
    slug: "setup-workflows",
    categoryId: "cat_workflows",
    content: "Configure automated task assignments and WhatsApp alerts when deals reach the proposal stage.",
    helpfulCount: 38,
    unhelpfulCount: 2,
    publishedAt: new Date(),
  },
];
