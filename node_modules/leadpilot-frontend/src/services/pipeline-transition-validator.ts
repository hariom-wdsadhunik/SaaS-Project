import { DealStage } from "./deal-mock-service";

const STAGE_ORDER: Record<DealStage, number> = {
  NEW: 1,
  QUALIFIED: 2,
  PROPOSAL_SENT: 3,
  NEGOTIATION: 4,
  WON: 5,
  LOST: 6,
};

const STAGE_DEFAULT_PROBABILITY: Record<DealStage, number> = {
  NEW: 30,
  QUALIFIED: 50,
  PROPOSAL_SENT: 70,
  NEGOTIATION: 85,
  WON: 100,
  LOST: 0,
};

export interface TransitionValidationResult {
  allowed: boolean;
  reason?: string;
  recommendedProbability: number;
}

export const PipelineTransitionValidator = {
  validateTransition(
    currentStage: DealStage,
    targetStage: DealStage
  ): TransitionValidationResult {
    const recommendedProbability = STAGE_DEFAULT_PROBABILITY[targetStage];

    // Same stage - no op
    if (currentStage === targetStage) {
      return { allowed: true, recommendedProbability };
    }

    // Terminal stage WON check: Closed WON deals cannot be reverted
    if (currentStage === "WON") {
      return {
        allowed: false,
        reason: "Closed WON deals cannot be reverted back without admin approval.",
        recommendedProbability,
      };
    }

    // Always allow moving to LOST from any active stage
    if (targetStage === "LOST") {
      return { allowed: true, recommendedProbability };
    }

    // Target is WON: allowed only from NEGOTIATION or PROPOSAL_SENT
    if (targetStage === "WON") {
      if (currentStage === "NEGOTIATION" || currentStage === "PROPOSAL_SENT") {
        return { allowed: true, recommendedProbability };
      }
      return {
        allowed: false,
        reason: "Deals can only be marked WON after reaching Proposal Sent or Negotiation.",
        recommendedProbability,
      };
    }

    const currentOrder = STAGE_ORDER[currentStage];
    const targetOrder = STAGE_ORDER[targetStage];

    // Allow forward movement or 1-step backward adjustment
    if (targetOrder >= currentOrder - 1) {
      return { allowed: true, recommendedProbability };
    }

    return {
      allowed: false,
      reason: `Direct transition from ${currentStage} to ${targetStage} is prohibited by pipeline business rules.`,
      recommendedProbability,
    };
  },
};
