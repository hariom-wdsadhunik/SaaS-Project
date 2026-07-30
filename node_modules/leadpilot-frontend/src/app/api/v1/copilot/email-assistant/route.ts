import { NextResponse } from "next/server";
import { EmailCopilotService } from "@/platform/copilot/EmailCopilotService";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();
  const result = await EmailCopilotService.processRequest(body);
  return NextResponse.json({ success: true, result });
}
