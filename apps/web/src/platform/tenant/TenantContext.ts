export interface TenantOrganization {
  id: string;
  name: string;
  domain: string;
  subscriptionTier: "STARTER" | "PROFESSIONAL" | "ENTERPRISE";
  maxUsers: number;
  maxStorageBytes: number;
  isActive: boolean;
}

export interface TenantUser {
  id: string;
  email: string;
  organizationId: string;
  role: "OWNER" | "ADMIN" | "MANAGER" | "BROKER" | "AGENT" | "VIEWER";
}

export class TenantContext {
  private static currentOrganization: TenantOrganization | null = null;
  private static currentUser: TenantUser | null = null;

  public static setContext(org: TenantOrganization, user: TenantUser): void {
    this.currentOrganization = org;
    this.currentUser = user;
  }

  public static getOrganization(): TenantOrganization {
    return (
      this.currentOrganization || {
        id: "org-001",
        name: "LeadPilot Enterprise Real Estate LLC",
        domain: "leadpilot.ai",
        subscriptionTier: "ENTERPRISE",
        maxUsers: 500,
        maxStorageBytes: 1099511627776, // 1TB
        isActive: true,
      }
    );
  }

  public static getUser(): TenantUser {
    return (
      this.currentUser || {
        id: "usr-001",
        email: "broker@leadpilot.ai",
        organizationId: "org-001",
        role: "ADMIN",
      }
    );
  }

  public static getOrganizationId(): string {
    return this.getOrganization().id;
  }
}
