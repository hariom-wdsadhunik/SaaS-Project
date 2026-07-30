"use client";

import React, { useState, useEffect } from "react";

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-amber-600 text-black py-2 px-4 text-center text-xs font-bold z-50 flex items-center justify-center space-x-3">
      <span>⚠️ Offline Mode: Changes will sync automatically once network connection is restored.</span>
      <button
        onClick={() => window.location.reload()}
        className="px-2 py-0.5 bg-black text-amber-400 rounded text-[10px] hover:bg-zinc-800"
      >
        Retry Sync
      </button>
    </div>
  );
}
