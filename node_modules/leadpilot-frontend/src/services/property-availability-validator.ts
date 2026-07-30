import { PropertyStatus } from "@/domain/property/types";

export interface PropertyTransitionResult {
  allowed: boolean;
  reason?: string;
}

export const PropertyAvailabilityValidator = {
  validateStatusTransition(
    currentStatus: PropertyStatus,
    targetStatus: PropertyStatus
  ): PropertyTransitionResult {
    // Same status - no op
    if (currentStatus === targetStatus) {
      return { allowed: true };
    }

    // Always allow moving to OFF_MARKET (Archived) from any active status
    if (targetStatus === "OFF_MARKET") {
      return { allowed: true };
    }

    // Closed / SOLD status check
    if (currentStatus === "SOLD") {
      return {
        allowed: false,
        reason: "Completed SOLD property listings cannot be reverted back to Available status.",
      };
    }

    // RESERVED status check
    if (currentStatus === "RESERVED" && targetStatus === "AVAILABLE") {
      return { allowed: true }; // Reservation cancelation
    }

    return { allowed: true };
  },
};
