import * as React from "react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { CommandPalette } from "@/components/ui/command-palette";
import { AIDrawer } from "@/components/ai/ai-drawer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-100">
        {/* Collapsible Navigation Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Global App Header */}
          <Header />

          {/* Dynamic Viewport Content */}
          <main className="flex-1 overflow-y-auto p-6 bg-zinc-950">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>

        {/* Global Interactive Overlays */}
        <CommandPalette />
        <AIDrawer />
      </div>
    </ProtectedRoute>
  );
}
