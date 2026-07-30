"use client";

import React, { useState } from "react";
import { ProductTourService, TourStep } from "@/platform/tour/ProductTourService";

interface ProductTourOverlayProps {
  moduleName: string;
  onComplete?: () => void;
}

export function ProductTourOverlay({ moduleName, onComplete }: ProductTourOverlayProps) {
  const steps: TourStep[] = ProductTourService.getTourSteps(moduleName);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIdx];

  const handleNext = () => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    } else {
      if (onComplete) onComplete();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 p-6 bg-zinc-900 border border-blue-500 rounded-xl shadow-2xl max-w-sm">
      <h4 className="text-sm font-semibold text-blue-400 mb-1">
        Tour: {moduleName} ({currentStepIdx + 1}/{steps.length})
      </h4>
      <h5 className="text-base font-bold text-white mb-2">{currentStep.title}</h5>
      <p className="text-xs text-zinc-300 mb-4">{currentStep.description}</p>

      <div className="flex justify-between items-center">
        <button onClick={onComplete} className="text-xs text-zinc-500 hover:text-zinc-300">
          Skip Tour
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-md transition"
        >
          {currentStepIdx === steps.length - 1 ? "Finish Tour" : "Next"}
        </button>
      </div>
    </div>
  );
}
