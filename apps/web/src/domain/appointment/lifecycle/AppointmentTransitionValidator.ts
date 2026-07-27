import { AppointmentStatus } from "../types";
import { ALLOWED_APPOINTMENT_TRANSITIONS } from "./AppointmentWorkflowRules";

export interface TransitionValidationResult {
  allowed: boolean;
  reason?: string;
}

export const AppointmentTransitionValidator = {
  validateTransition(currentStatus: AppointmentStatus, targetStatus: AppointmentStatus): TransitionValidationResult {
    if (currentStatus === targetStatus) return { allowed: true };

    const allowedTargets = ALLOWED_APPOINTMENT_TRANSITIONS[currentStatus] || [];
    const isAllowed = allowedTargets.includes(targetStatus);

    return {
      allowed: isAllowed,
      reason: isAllowed
        ? undefined
        : `Transition from ${currentStatus} to ${targetStatus} is not permitted by appointment workflow rules.`,
    };
  },
};
