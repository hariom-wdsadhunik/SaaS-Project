import { AppointmentEntity } from "../types";

export interface AppointmentConflictResult {
  hasConflict: boolean;
  conflictingAppointments: AppointmentEntity[];
  reason?: string;
}

export const AppointmentConflictService = {
  detectConflicts(
    targetStart: string,
    targetEnd: string,
    agentName: string,
    locationName: string,
    existingAppointments: AppointmentEntity[],
    excludeId?: string
  ): AppointmentConflictResult {
    const tStart = new Date(targetStart).getTime();
    const tEnd = new Date(targetEnd).getTime();

    if (isNaN(tStart) || isNaN(tEnd) || tEnd <= tStart) {
      return {
        hasConflict: true,
        conflictingAppointments: [],
        reason: "Invalid appointment timeframe.",
      };
    }

    const conflicts = existingAppointments.filter((apt) => {
      if (excludeId && apt.id === excludeId) return false;
      const eStart = new Date(apt.startTime).getTime();
      const eEnd = new Date(apt.endTime).getTime();

      const timeOverlaps = tStart < eEnd && tEnd > eStart;
      if (!timeOverlaps) return false;

      const agentConflict = (apt.assignedTo || "").toLowerCase() === agentName.toLowerCase();
      const locationConflict = (apt.location || "").toLowerCase() === locationName.toLowerCase();

      return agentConflict || locationConflict;
    });

    return {
      hasConflict: conflicts.length > 0,
      conflictingAppointments: conflicts,
      reason: conflicts.length > 0 ? `Schedule overlaps with ${conflicts.length} existing booking(s).` : undefined,
    };
  },
};
