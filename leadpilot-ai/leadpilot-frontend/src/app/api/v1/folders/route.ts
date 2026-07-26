import { NextResponse } from "next/server";
import { supabaseDocumentRepository } from "@/infrastructure/repositories/SupabaseDocumentRepository";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const folderId = searchParams.get("id") || undefined;

  const docs = await supabaseDocumentRepository.listByFolder(folderId);
  return NextResponse.json({ version: "v1", success: true, count: docs.length, data: docs });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const folder = await supabaseDocumentRepository.createFolder(body.name, body.parentFolderId, body.ownerId);
    return NextResponse.json({ version: "v1", success: true, data: folder }, { status: 201 });
  } catch {
    return NextResponse.json({ version: "v1", success: false, error: "Invalid folder payload" }, { status: 400 });
  }
}
