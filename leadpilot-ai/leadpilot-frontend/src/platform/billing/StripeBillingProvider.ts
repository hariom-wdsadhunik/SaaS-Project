import { BillingProvider, CheckoutSessionOptions, CustomerPortalOptions } from "./BillingProvider";
import { Subscription } from "@/domain/billing/Subscription";
import { Invoice } from "@/domain/billing/Invoice";

export class StripeBillingProvider implements BillingProvider {
  async createCheckoutSession(options: CheckoutSessionOptions): Promise<{ url: string; sessionId: string }> {
    const mockSessionId = `cs_test_${Date.now()}`;
    return {
      url: `${options.successUrl}?session_id=${mockSessionId}`,
      sessionId: mockSessionId,
    };
  }

  async createCustomerPortal(options: CustomerPortalOptions): Promise<{ url: string }> {
    return {
      url: `${options.returnUrl}?portal=active&customer=${options.stripeCustomerId}`,
    };
  }

  async getSubscription(subscriptionId: string): Promise<Subscription | null> {
    return {
      id: subscriptionId,
      organizationId: "org_default",
      planId: "plan_professional",
      status: "active",
      seats: 5,
      interval: "month",
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      cancelAtPeriodEnd: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async cancelSubscription(_subscriptionId: string): Promise<boolean> {
    return true;
  }

  async getInvoices(organizationId: string): Promise<Invoice[]> {
    return [
      {
        id: "inv_1001",
        organizationId,
        subscriptionId: "sub_1001",
        amountDueUsd: 149,
        amountPaidUsd: 149,
        status: "paid",
        lines: [{ description: "LeadPilot Professional Monthly Plan (5 seats)", amountUsd: 149, quantity: 1 }],
        createdAt: new Date(),
        paidAt: new Date(),
      },
    ];
  }
}
