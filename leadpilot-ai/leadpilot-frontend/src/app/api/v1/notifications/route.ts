import { NextResponse } from "next/server";
import { notificationService } from "@/platform/notifications/NotificationService";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || "agent-001";

  const list = await notificationService.getUserNotifications(userId);
  const unreadCount = await notificationService.getUnreadCount(userId);

  return NextResponse.json({ version: "v1", success: true, unreadCount, data: list });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = await notificationService.sendNotification(body);
    return NextResponse.json({ version: "v1", success: true, data: created }, { status: 201 });
  } catch {
    return NextResponse.json({ version: "v1", success: false, error: "Failed to dispatch notification" }, { status: 400 });
  }
}
