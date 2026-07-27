import { CalendarEventEntity } from "../types";

export interface ConflictResult {
  hasConflict: boolean;
  conflictingEvents: CalendarEventEntity[];
  reason?: string;
}

export const ConflictDetectionService = {
  detectConflicts(
    targetStart: string,
    targetEnd: string,
    existingEvents: CalendarEventEntity[],
    excludeEventId?: string
  ): ConflictResult {
    const tStart = new Date(targetStart).getTime();
    const tEnd = new Date(targetEnd).getTime();

    if (isNaN(tStart) || isNaN(tEnd) || tEnd <= tStart) {
      return {
        hasConflict: true,
        conflictingEvents: [],
        reason: "Invalid time range: End time must be after Start time.",
      };
    }

    const conflicts = existingEvents.filter((evt) => {
      if (excludeEventId && evt.id === excludeEventId) return false;
      const eStart = new Date(evt.start).getTime();
      const eEnd = new Date(evt.end).getTime();
      return tStart < eEnd && tEnd > eStart;
    });

    return {
      hasConflict: conflicts.length > 0,
      conflictingEvents: conflicts,
      reason: conflicts.length > 0 ? `Overlaps with ${conflicts.length} existing event(s).` : undefined,
    };
  },
};
