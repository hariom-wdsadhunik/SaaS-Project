import { Subscription } from "@/domain/billing/Subscription";
import { Invoice } from "@/domain/billing/Invoice";

export interface CheckoutSessionOptions {
  organizationId: string;
  planId: string;
  seats: number;
  interval: "month" | "year";
  successUrl: string;
  cancelUrl: string;
}

export interface CustomerPortalOptions {
  stripeCustomerId: string;
  returnUrl: string;
}

export interface BillingProvider {
  createCheckoutSession(options: CheckoutSessionOptions): Promise<{ url: string; sessionId: string }>;
  createCustomerPortal(options: CustomerPortalOptions): Promise<{ url: string }>;
  getSubscription(subscriptionId: string): Promise<Subscription | null>;
  cancelSubscription(subscriptionId: string): Promise<boolean>;
  getInvoices(organizationId: string): Promise<Invoice[]>;
}
