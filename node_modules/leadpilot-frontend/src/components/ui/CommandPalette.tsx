"use client";

import React, { useState, useEffect } from "react";

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isOpen) return null;

  const commands = [
    { title: "Go to Dashboard", url: "/dashboard" },
    { title: "View Lead Queue", url: "/leads" },
    { title: "View Deal Pipeline", url: "/deals" },
    { title: "Open AI Workspace Copilot", url: "/copilot" },
    { title: "View Document Repository", url: "/documents" },
  ].filter((c) => c.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-xl w-full p-4 shadow-2xl space-y-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search CRM commands, leads, deals (⌘K)..."
          className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
          autoFocus
        />
        <div className="max-h-60 overflow-y-auto space-y-1">
          {commands.map((cmd, idx) => (
            <button
              key={idx}
              onClick={() => {
                window.location.href = cmd.url;
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-lg transition"
            >
              {cmd.title}
            </button>
          ))}
          {commands.length === 0 && <p className="p-4 text-xs text-zinc-500 text-center">No matching commands found.</p>}
        </div>
      </div>
    </div>
  );
}
