import { TimelineEventEntity } from "../types";

export const TimelineService = {
  getTimelineEvents(conversationId: string): TimelineEventEntity[] {
    return [
      {
        id: "tl-1",
        conversationId,
        eventType: "MESSAGE_SENT",
        description: "WhatsApp message delivered to customer",
        actorName: "Alex Morgan",
        timestamp: new Date().toISOString(),
      },
    ];
  },
};
