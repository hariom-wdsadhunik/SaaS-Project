"use client";

import * as React from "react";
import { Bell, Check } from "lucide-react";
import { notificationService } from "./NotificationService";
import { NotificationPayload } from "./NotificationTypes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface NotificationCenterProps {
  userId?: string;
}

export function NotificationCenter({ userId = "user-system" }: NotificationCenterProps) {
  const [notifications, setNotifications] = React.useState<NotificationPayload[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(0);

  React.useEffect(() => {
    let isMounted = true;

    const fetchNotifications = async () => {
      const list = await notificationService.getUserNotifications(userId);
      const count = await notificationService.getUnreadCount(userId);
      if (isMounted) {
        setNotifications(list);
        setUnreadCount(count);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 2000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [userId]);

  const handleMarkAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
    const list = await notificationService.getUserNotifications(userId);
    const count = await notificationService.getUnreadCount(userId);
    setNotifications(list);
    setUnreadCount(count);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white font-mono animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 shadow-2xl z-50 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                Notifications Center
              </h3>
              {unreadCount > 0 && (
                <Badge variant="outline" className="text-[10px] text-indigo-400">
                  {unreadCount} New
                </Badge>
              )}
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="h-6 text-[11px] text-zinc-400 hover:text-white"
            >
              Close
            </Button>
          </div>

          <div className="max-h-72 overflow-y-auto space-y-2 text-xs divide-y divide-zinc-900">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-zinc-500 font-mono text-[11px]">
                No active notifications.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`pt-2.5 space-y-1 ${n.isRead ? "opacity-60" : "opacity-100"}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-white truncate">{n.title}</span>
                    <Badge variant="outline" className="text-[9px] font-mono uppercase">
                      {n.channel}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{n.message}</p>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-zinc-500 font-mono">
                    <span>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {!n.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(n.id)}
                        className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold"
                      >
                        <Check className="h-3 w-3" />
                        <span>Mark read</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
