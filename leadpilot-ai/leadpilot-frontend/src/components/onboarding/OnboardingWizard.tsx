"use client";

import React, { useState } from "react";
import { SampleDataLoader } from "@/platform/onboarding/SampleDataLoader";

export function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const [orgName, setOrgName] = useState("LeadPilot Real Estate LLC");
  const [teamEmail, setTeamEmail] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  const handleNext = async () => {
    if (step === 3) {
      await SampleDataLoader.loadSampleCRMData("org-001");
      setIsCompleted(true);
    } else {
      setStep((prev) => prev + 1);
    }
  };

  if (isCompleted) {
    return (
      <div className="p-8 max-w-xl mx-auto bg-zinc-900 border border-zinc-800 rounded-xl text-center">
        <h2 className="text-2xl font-bold text-emerald-400 mb-2">🎉 Workspace Ready!</h2>
        <p className="text-zinc-400 mb-6">Your organization sample data has been seeded successfully.</p>
        <button
          onClick={() => (window.location.href = "/dashboard")}
          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-xl mx-auto bg-zinc-900 border border-zinc-800 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">LeadPilot Welcome Setup ({step}/3)</h3>
        <span className="text-xs text-zinc-500">Step {step} of 3</span>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <label className="block text-sm text-zinc-300">Organization Name</label>
          <input
            type="text"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
          />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <label className="block text-sm text-zinc-300">Invite Team Member (Email)</label>
          <input
            type="email"
            value={teamEmail}
            onChange={(e) => setTeamEmail(e.target.value)}
            placeholder="colleague@leadpilot.ai"
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
          />
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4 text-zinc-300">
          <p>Click finish to seed workspace sample leads, deals, documents, and analytics metrics.</p>
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition"
        >
          {step === 3 ? "Complete Setup" : "Continue"}
        </button>
      </div>
    </div>
  );
}
