"use client";

import * as React from "react";
import { DealColumn } from "./deal-column";
import { DealItem, DealStage, dealMockService } from "@/services/deal-mock-service";
import { PipelineTransitionValidator } from "@/services/pipeline-transition-validator";
import { toast } from "sonner";

interface DealsBoardProps {
  deals: DealItem[];
  onDealStageChange: (dealId: string, newStage: DealStage, newProbability: number) => void;
  onSelectDeal?: (deal: DealItem) => void;
}

const STAGES_CONFIG: { id: DealStage; title: string; color: string }[] = [
  { id: "NEW", title: "New Inquiry", color: "bg-blue-500" },
  { id: "QUALIFIED", title: "Qualified", color: "bg-indigo-500" },
  { id: "PROPOSAL_SENT", title: "Proposal Sent", color: "bg-amber-500" },
  { id: "NEGOTIATION", title: "Negotiation", color: "bg-violet-500" },
  { id: "WON", title: "Won / Closed", color: "bg-emerald-500" },
  { id: "LOST", title: "Lost", color: "bg-red-500" },
];

export function DealsBoard({ deals, onDealStageChange, onSelectDeal }: DealsBoardProps) {
  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData("text/plain", dealId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, targetStage: DealStage) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData("text/plain");

    if (!dealId) return;

    const targetDeal = deals.find((d) => d.id === dealId);
    if (!targetDeal || targetDeal.stage === targetStage) return;

    // Pipeline Business Rule Validation
    const validation = PipelineTransitionValidator.validateTransition(
      targetDeal.stage,
      targetStage
    );

    if (!validation.allowed) {
      toast.error(`Transition Blocked: ${validation.reason}`);
      return;
    }

    // Optimistic UI state update with recalculated win probability
    onDealStageChange(dealId, targetStage, validation.recommendedProbability);
    toast.success(`Moved "${targetDeal.title}" to ${targetStage} (${validation.recommendedProbability}% Win Prob)`);

    // Telemetry & Service update
    await dealMockService.moveDealStage(dealId, targetStage);
  };

  return (
    <div className="flex items-start gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar select-none">
      {STAGES_CONFIG.map((stage) => {
        const stageDeals = deals.filter((d) => d.stage === stage.id);
        return (
          <DealColumn
            key={stage.id}
            stageId={stage.id}
            stageTitle={stage.title}
            stageColor={stage.color}
            deals={stageDeals}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onSelectDeal={onSelectDeal}
          />
        );
      })}
    </div>
  );
}
