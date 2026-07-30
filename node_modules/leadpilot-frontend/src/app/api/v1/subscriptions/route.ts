import { NextResponse } from "next/server";
import { StripeBillingProvider } from "@/platform/billing/StripeBillingProvider";

export const dynamic = "force-dynamic";

export async function GET() {
  const provider = new StripeBillingProvider();
  const subscription = await provider.getSubscription("sub_1001");
  return NextResponse.json({ success: true, subscription });
}
