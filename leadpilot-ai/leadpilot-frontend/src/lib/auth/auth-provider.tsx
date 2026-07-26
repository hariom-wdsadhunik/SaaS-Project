"use client";

import * as React from "react";
import { authClient } from "./auth-client";
import { authService, AuthSessionUser } from "./auth-service";
import { SystemRole } from "@/platform/auth/RoleDefinitions";
import { AuthorizationProvider } from "@/platform/auth/AuthorizationContext";
import { useAuthStore } from "@/store/use-auth-store";

interface AuthContextValue {
  user: AuthSessionUser | null;
  role: SystemRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ user: AuthSessionUser; token: string }>;
  logout: () => Promise<void>;
  forgotPassword: typeof authService.forgotPassword;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthSessionUser | null>(null);
  const [role, setRole] = React.useState<SystemRole>("ADMIN");
  const [isLoading, setIsLoading] = React.useState(true);
  const { setAuth, logout: storeLogout } = useAuthStore();

  React.useEffect(() => {
    let isMounted = true;

    // Check active session
    authService.getCurrentSession().then((session) => {
      if (!isMounted) return;
      if (session?.user) {
        const sessionUser: AuthSessionUser = {
          id: session.user.id,
          email: session.user.email || "",
          fullName: session.user.user_metadata?.full_name || "Alex Morgan",
          role: (session.user.user_metadata?.role as SystemRole) || "ADMIN",
          avatarUrl: session.user.user_metadata?.avatar_url,
        };
        setUser(sessionUser);
        setRole(sessionUser.role);
        setAuth(
          {
            id: sessionUser.id,
            name: sessionUser.fullName,
            email: sessionUser.email,
            role: authService.mapRoleToUserProfileRole(sessionUser.role),
            avatarUrl: sessionUser.avatarUrl,
          },
          session.access_token
        );
      }
      setIsLoading(false);
    });

    // Listen for auth state changes
    const { data: authListener } = authClient.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      if (session?.user) {
        const sessionUser: AuthSessionUser = {
          id: session.user.id,
          email: session.user.email || "",
          fullName: session.user.user_metadata?.full_name || "Alex Morgan",
          role: (session.user.user_metadata?.role as SystemRole) || "ADMIN",
          avatarUrl: session.user.user_metadata?.avatar_url,
        };
        setUser(sessionUser);
        setRole(sessionUser.role);
      } else {
        setUser(null);
      }
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [setAuth]);

  const login = React.useCallback(
    async (email: string, pass: string) => {
      const res = await authService.loginWithEmail(email, pass);
      setUser(res.user);
      setRole(res.user.role);
      setAuth(
        {
          id: res.user.id,
          name: res.user.fullName,
          email: res.user.email,
          role: authService.mapRoleToUserProfileRole(res.user.role),
          avatarUrl: res.user.avatarUrl,
        },
        res.token
      );
      return res;
    },
    [setAuth]
  );

  const logout = React.useCallback(async () => {
    await authService.logout();
    setUser(null);
    storeLogout();
  }, [storeLogout]);

  const value = React.useMemo(
    () => ({
      user,
      role,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      forgotPassword: authService.forgotPassword,
    }),
    [user, role, isLoading, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      <AuthorizationProvider>{children}</AuthorizationProvider>
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
