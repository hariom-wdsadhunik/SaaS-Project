import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();
  const newFeedback = {
    id: `fb_${Date.now()}`,
    userId: body.userId || "usr_default",
    organizationId: body.organizationId || "org_default",
    type: body.type || "general_feedback",
    rating: body.rating || 5,
    message: body.message || "",
    pageUrl: body.pageUrl || "/",
    createdAt: new Date(),
  };

  return NextResponse.json({ success: true, feedback: newFeedback });
}
