export type SystemRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "MANAGER"
  | "BROKER"
  | "SALES_AGENT"
  | "SUPPORT_AGENT"
  | "VIEWER";

export interface RoleConfig {
  id: SystemRole;
  name: string;
  description: string;
}

export const SYSTEM_ROLES: Record<SystemRole, RoleConfig> = {
  SUPER_ADMIN: {
    id: "SUPER_ADMIN",
    name: "Super Administrator",
    description: "Full unhindered system & tenant administration rights.",
  },
  ADMIN: {
    id: "ADMIN",
    name: "Administrator",
    description: "Tenant configuration, user management, and operational controls.",
  },
  MANAGER: {
    id: "MANAGER",
    name: "Sales Manager",
    description: "Team management, analytics access, and approval permissions.",
  },
  BROKER: {
    id: "BROKER",
    name: "Senior Sales Broker",
    description: "Standard CRM record management for leads, deals, properties, tasks.",
  },
  SALES_AGENT: {
    id: "SALES_AGENT",
    name: "Sales Agent",
    description: "Standard CRM record management for leads, deals, properties, tasks.",
  },
  SUPPORT_AGENT: {
    id: "SUPPORT_AGENT",
    name: "Support Agent",
    description: "Read-heavy support access for contacts and tasks.",
  },
  VIEWER: {
    id: "VIEWER",
    name: "Read-Only Viewer",
    description: "Read-only access across CRM modules.",
  },
};
