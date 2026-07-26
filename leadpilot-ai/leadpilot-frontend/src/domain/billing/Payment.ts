export type PaymentStatus = "succeeded" | "processing" | "failed";

export interface Payment {
  id: string;
  organizationId: string;
  amountUsd: number;
  currency: string;
  status: PaymentStatus;
  stripePaymentIntentId?: string;
  createdAt: Date;
}
