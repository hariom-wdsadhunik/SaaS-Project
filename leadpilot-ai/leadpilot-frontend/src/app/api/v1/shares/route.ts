import { NextResponse } from "next/server";
import { supabaseDocumentRepository } from "@/infrastructure/repositories/SupabaseDocumentRepository";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const shared = await supabaseDocumentRepository.share(body.documentId, body.userId, body.level || "READ");
    return NextResponse.json({ version: "v1", success: shared, documentId: body.documentId, sharedWith: body.userId });
  } catch {
    return NextResponse.json({ version: "v1", success: false, error: "Failed to share document" }, { status: 400 });
  }
}
