export type InvoiceStatus = "draft" | "open" | "paid" | "uncollectible" | "void";

export interface InvoiceLineItem {
  description: string;
  amountUsd: number;
  quantity: number;
}

export interface Invoice {
  id: string;
  organizationId: string;
  subscriptionId: string;
  amountDueUsd: number;
  amountPaidUsd: number;
  status: InvoiceStatus;
  lines: InvoiceLineItem[];
  pdfUrl?: string;
  stripeInvoiceId?: string;
  createdAt: Date;
  paidAt?: Date;
}
