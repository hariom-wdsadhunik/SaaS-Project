import { NextResponse } from "next/server";
import { StripeBillingProvider } from "@/platform/billing/StripeBillingProvider";

export async function GET() {
  const provider = new StripeBillingProvider();
  const invoices = await provider.getInvoices("org_default");
  return NextResponse.json({ success: true, invoices });
}

export async function POST(request: Request) {
  const body = await request.json();
  const provider = new StripeBillingProvider();

  const session = await provider.createCheckoutSession({
    organizationId: body.organizationId || "org_default",
    planId: body.planId || "plan_professional",
    seats: body.seats || 1,
    interval: body.interval || "month",
    successUrl: "http://localhost:3000/billing?status=success",
    cancelUrl: "http://localhost:3000/billing?status=cancel",
  });

  return NextResponse.json({ success: true, checkoutUrl: session.url, sessionId: session.sessionId });
}
