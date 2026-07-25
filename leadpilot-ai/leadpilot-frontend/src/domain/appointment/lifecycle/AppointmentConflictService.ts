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
    propertyName: string,
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
      const eStart = new Date(apt.start).getTime();
      const eEnd = new Date(apt.end).getTime();

      const timeOverlaps = tStart < eEnd && tEnd > eStart;
      if (!timeOverlaps) return false;

      const agentConflict = apt.assignedAgentName.toLowerCase() === agentName.toLowerCase();
      const propertyConflict = apt.propertyName.toLowerCase() === propertyName.toLowerCase();

      return agentConflict || propertyConflict;
    });

    return {
      hasConflict: conflicts.length > 0,
      conflictingAppointments: conflicts,
      reason: conflicts.length > 0 ? `Schedule overlaps with ${conflicts.length} existing booking(s).` : undefined,
    };
  },
};
