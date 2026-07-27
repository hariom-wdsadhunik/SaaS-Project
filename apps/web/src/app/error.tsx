"use client";

import React from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="p-6 bg-zinc-900 border border-red-900/50 rounded-2xl max-w-md w-full">
        <h1 className="text-4xl font-bold text-red-500 mb-2">System Error</h1>
        <p className="text-sm text-zinc-300 mb-4">
          {error.message || "An unexpected error occurred while executing the workspace action."}
        </p>
        <button
          onClick={() => reset()}
          className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-medium text-sm rounded-lg transition"
        >
          Retry Operation
        </button>
      </div>
    </div>
  );
}
