import * as React from "react";
import { DealCard } from "./deal-card";
import { DealItem, DealStage } from "@/services/deal-mock-service";
import { formatCurrency } from "@/utils/formatters";

interface DealColumnProps {
  stageId: DealStage;
  stageTitle: string;
  stageColor: string;
  deals: DealItem[];
  onDragStart: (e: React.DragEvent, dealId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetStage: DealStage) => void;
}

export function DealColumn({
  stageId,
  stageTitle,
  stageColor,
  deals,
  onDragStart,
  onDragOver,
  onDrop,
}: DealColumnProps) {
  const columnTotalValue = deals.reduce((sum, d) => sum + d.value, 0);

  return (
    <div
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, stageId)}
      className="flex flex-col w-72 lg:w-80 shrink-0 rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-3 h-[calc(100vh-240px)] min-h-[500px]"
    >
      {/* Column Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className={`h-2.5 w-2.5 rounded-full ${stageColor}`} />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">{stageTitle}</h3>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-mono font-bold text-zinc-400">
            {deals.length}
          </span>
        </div>

        <span className="text-xs font-mono font-bold text-zinc-300">
          {formatCurrency(columnTotalValue)}
        </span>
      </div>

      {/* Cards List Container */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {deals.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800/80 p-8 text-center h-48 my-auto">
            <span className="text-xs font-medium text-zinc-500">No Deals in Stage</span>
            <span className="text-[10px] text-zinc-600 mt-1">Drag deal card here</span>
          </div>
        ) : (
          deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} onDragStart={onDragStart} />
          ))
        )}
      </div>
    </div>
  );
}
