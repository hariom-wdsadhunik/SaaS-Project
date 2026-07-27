import { NextResponse } from "next/server";
import { HelpCenterService } from "@/platform/support/HelpCenterService";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";

  const service = new HelpCenterService();
  const articles = q ? service.searchArticles(q) : service.getArticles();
  const categories = service.getCategories();

  return NextResponse.json({ success: true, articles, categories });
}
