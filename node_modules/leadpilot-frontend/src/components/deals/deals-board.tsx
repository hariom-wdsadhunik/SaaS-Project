"use client";

import * as React from "react";
import { DealColumn } from "./deal-column";
import { DealItem, DealStage } from "@/services/deal-mock-service";
import { PipelineTransitionValidator } from "@/services/pipeline-transition-validator";
import { toast } from "sonner";

interface DealsBoardProps {
  deals: DealItem[];
  onDealStageChange: (dealId: string, newStage: DealStage, newProbability: number) => Promise<void> | void;
  onSelectDeal?: (deal: DealItem) => void;
  onDeleteDeal?: (deal: DealItem) => void;
}

const STAGES_CONFIG: { id: DealStage; title: string; color: string }[] = [
  { id: "NEW", title: "New Inquiry", color: "bg-blue-500" },
  { id: "QUALIFIED", title: "Qualified", color: "bg-indigo-500" },
  { id: "PROPOSAL_SENT", title: "Proposal Sent", color: "bg-amber-500" },
  { id: "NEGOTIATION", title: "Negotiation", color: "bg-violet-500" },
  { id: "WON", title: "Won / Closed", color: "bg-emerald-500" },
  { id: "LOST", title: "Lost", color: "bg-red-500" },
];

export function DealsBoard({ deals, onDealStageChange, onSelectDeal, onDeleteDeal }: DealsBoardProps) {
  const draggedDealIdRef = React.useRef<string | null>(null);

  const handleDragStart = React.useCallback((e: React.DragEvent, dealId: string) => {
    console.log(`[Kanban DnD] onDragStart triggered for dealId: ${dealId}`);
    draggedDealIdRef.current = dealId;
    e.dataTransfer.setData("text/plain", dealId);
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = React.useCallback(
    async (e: React.DragEvent, targetStage: DealStage) => {
      e.preventDefault();
      const dealId = e.dataTransfer.getData("text/plain") || draggedDealIdRef.current;
      draggedDealIdRef.current = null;

      console.log(`[Kanban DnD] onDrop triggered for dealId: ${dealId} -> targetStage: ${targetStage}`);

      if (!dealId) {
        console.warn("[Kanban DnD] Drop ignored: No dealId found in event context");
        return;
      }

      const targetDeal = deals.find((d) => d.id === dealId);
      if (!targetDeal) {
        console.warn(`[Kanban DnD] Drop ignored: Deal ${dealId} not found in active state`);
        return;
      }

      if (targetDeal.stage === targetStage) {
        console.log(`[Kanban DnD] Drop ignored: Deal ${dealId} is already in ${targetStage}`);
        return;
      }

      // Pipeline Business Rule Validation
      const validation = PipelineTransitionValidator.validateTransition(
        targetDeal.stage,
        targetStage
      );

      if (!validation.allowed) {
        console.warn(`[Kanban DnD] Transition blocked: ${validation.reason}`);
        toast.error(`Transition Blocked: ${validation.reason}`);
        return;
      }

      console.log(`[Kanban DnD] Transition approved: ${targetDeal.stage} -> ${targetStage} (${validation.recommendedProbability}%)`);

      // Trigger stage change in parent (Page component)
      await onDealStageChange(dealId, targetStage, validation.recommendedProbability);
    },
    [deals, onDealStageChange]
  );

  return (
    <div
      role="region"
      aria-label="Deals Kanban Pipeline Board"
      className="flex items-start gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar select-none"
    >
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
            onDeleteDeal={onDeleteDeal}
          />
        );
      })}
    </div>
  );
}
