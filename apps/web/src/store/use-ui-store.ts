import { create } from "zustand";

interface UIState {
  isSidebarCollapsed: boolean;
  isCommandPaletteOpen: boolean;
  isAIDrawerOpen: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setAIDrawerOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarCollapsed: false,
  isCommandPaletteOpen: false,
  isAIDrawerOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  setAIDrawerOpen: (open) => set({ isAIDrawerOpen: open }),
}));
