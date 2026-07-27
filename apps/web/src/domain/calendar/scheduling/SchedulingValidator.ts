import { CalendarEventEntity } from "../types";
import { ConflictDetectionService, ConflictResult } from "./ConflictDetectionService";

export const SchedulingValidator = {
  validateEventPlacement(
    start: string,
    end: string,
    existingEvents: CalendarEventEntity[],
    excludeId?: string
  ): ConflictResult {
    return ConflictDetectionService.detectConflicts(start, end, existingEvents, excludeId);
  },
};
