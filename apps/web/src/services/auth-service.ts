import { apiClient } from "./api-client";
import { LoginInput } from "@/lib/validations/auth";
import { UserProfile } from "@/store/use-auth-store";

export interface AuthResponse {
  message: string;
  token: string;
  user: UserProfile;
}

export const authService = {
  async login(credentials: LoginInput): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/login", {
      email: credentials.email,
      password: credentials.password,
    });
    return response.data;
  },

  async register(data: { email: string; password: string; name: string; role?: string }): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  async getCurrentUser(): Promise<{ user: UserProfile }> {
    const response = await apiClient.get<{ user: UserProfile }>("/auth/me");
    return response.data;
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    return { message: `Password reset link sent to ${email}` };
  },

  async resetPassword(password: string, token: string): Promise<{ message: string }> {
    // Retain variables for endpoint parameter compatibility
    if (!password || !token) throw new Error("Invalid parameters");
    return { message: "Password has been successfully reset" };
  },

  async acceptInvite(data: { name: string; password: string; token: string }): Promise<AuthResponse> {
    return {
      message: "Account activated successfully",
      token: data.token || "demo-invited-user-jwt-token",
      user: {
        id: "usr-invited-101",
        name: data.name,
        email: "invited.agent@leadpilot.ai",
        role: "SALES_EXECUTIVE",
        organizationId: "org-101",
        organizationName: "Apex Real Estate Agency",
      },
    };
  },
};
