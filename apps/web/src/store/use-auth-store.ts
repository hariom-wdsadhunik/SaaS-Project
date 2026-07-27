import { create } from "zustand";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "OWNER" | "ADMIN" | "BROKER_LEAD" | "SALES_EXECUTIVE";
  avatarUrl?: string;
  organizationId?: string;
  organizationName?: string;
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: UserProfile, token: string) => void;
  logout: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user, token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("leadpilot_token", token);
      localStorage.setItem("leadpilot_user", JSON.stringify(user));
    }
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("leadpilot_token");
      localStorage.removeItem("leadpilot_user");
    }
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  initializeAuth: () => {
    if (typeof window === "undefined") return;

    try {
      const storedToken = localStorage.getItem("leadpilot_token");
      const storedUser = localStorage.getItem("leadpilot_user");

      if (storedToken && storedUser) {
        const user = JSON.parse(storedUser);
        set({ user, token: storedToken, isAuthenticated: true, isLoading: false });
      } else {
        // Fallback for initial demo session if desired, or set unauthenticated
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      }
    } catch {
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
