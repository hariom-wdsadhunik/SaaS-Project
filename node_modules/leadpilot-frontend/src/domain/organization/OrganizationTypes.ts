export type UserRole = "Owner" | "Admin" | "Manager" | "Agent" | "Viewer";

export type ResourceDomain =
  | "Leads"
  | "Deals"
  | "Tasks"
  | "Properties"
  | "Analytics"
  | "Billing"
  | "Settings"
  | "Team"
  | "Documents";

export type PermissionAction =
  | "Create"
  | "Read"
  | "Update"
  | "Delete"
  | "Export"
  | "Assign";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  timezone: string;
  subscriptionPlan: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  organizationId: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  status: "ACTIVE" | "DEACTIVATED" | "INVITED";
  onlineStatus: "ONLINE" | "OFFLINE" | "AWAY";
  lastLoginAt: string;
  joinedAt: string;
}

export interface TeamInvitation {
  id: string;
  organizationId: string;
  email: string;
  role: UserRole;
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
  status: "PENDING" | "ACCEPTED" | "EXPIRED" | "REVOKED";
}

export interface ActivityEvent {
  id: string;
  organizationId: string;
  userId: string;
  userName: string;
  action: string;
  objectType: ResourceDomain;
  objectId: string;
  objectTitle: string;
  timestamp: string;
}

export interface AuditRecord {
  id: string;
  organizationId: string;
  userId: string;
  userEmail: string;
  category: "AUTHENTICATION" | "RBAC_CHANGE" | "BILLING" | "ADMIN_ACTION" | "WORKSPACE_CHANGE" | "DATA_EXPORT";
  action: string;
  ipAddress: string;
  details: string;
  timestamp: string;
}
