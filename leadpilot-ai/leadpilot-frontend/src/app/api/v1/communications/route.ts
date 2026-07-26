import { NextResponse } from "next/server";
import { supabaseCommunicationRepository } from "@/infrastructure/repositories/SupabaseCommunicationRepository";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get("id") || "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d";

  const conversation = await supabaseCommunicationRepository.getConversation(conversationId);
  return NextResponse.json({ version: "v1", success: true, data: conversation });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = await supabaseCommunicationRepository.createConversation(body);
    return NextResponse.json({ version: "v1", success: true, data: created }, { status: 201 });
  } catch {
    return NextResponse.json({ version: "v1", success: false, error: "Invalid request payload" }, { status: 400 });
  }
}
