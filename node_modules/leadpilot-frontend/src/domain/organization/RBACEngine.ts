import { UserRole, ResourceDomain, PermissionAction } from "./OrganizationTypes";

export class RBACEngine {
  private static permissionsMap: Record<UserRole, Record<ResourceDomain, PermissionAction[]>> = {
    Owner: {
      Leads: ["Create", "Read", "Update", "Delete", "Export", "Assign"],
      Deals: ["Create", "Read", "Update", "Delete", "Export", "Assign"],
      Tasks: ["Create", "Read", "Update", "Delete", "Export", "Assign"],
      Properties: ["Create", "Read", "Update", "Delete", "Export", "Assign"],
      Analytics: ["Create", "Read", "Update", "Delete", "Export", "Assign"],
      Billing: ["Create", "Read", "Update", "Delete", "Export", "Assign"],
      Settings: ["Create", "Read", "Update", "Delete", "Export", "Assign"],
      Team: ["Create", "Read", "Update", "Delete", "Export", "Assign"],
      Documents: ["Create", "Read", "Update", "Delete", "Export", "Assign"],
    },
    Admin: {
      Leads: ["Create", "Read", "Update", "Delete", "Export", "Assign"],
      Deals: ["Create", "Read", "Update", "Delete", "Export", "Assign"],
      Tasks: ["Create", "Read", "Update", "Delete", "Export", "Assign"],
      Properties: ["Create", "Read", "Update", "Delete", "Export", "Assign"],
      Analytics: ["Create", "Read", "Update", "Delete", "Export", "Assign"],
      Billing: ["Read", "Export"],
      Settings: ["Create", "Read", "Update", "Delete", "Export"],
      Team: ["Create", "Read", "Update", "Delete", "Export", "Assign"],
      Documents: ["Create", "Read", "Update", "Delete", "Export", "Assign"],
    },
    Manager: {
      Leads: ["Create", "Read", "Update", "Export", "Assign"],
      Deals: ["Create", "Read", "Update", "Export", "Assign"],
      Tasks: ["Create", "Read", "Update", "Delete", "Assign"],
      Properties: ["Create", "Read", "Update", "Export"],
      Analytics: ["Read", "Export"],
      Billing: [],
      Settings: ["Read"],
      Team: ["Read", "Assign"],
      Documents: ["Create", "Read", "Update", "Export"],
    },
    Agent: {
      Leads: ["Create", "Read", "Update"],
      Deals: ["Create", "Read", "Update"],
      Tasks: ["Create", "Read", "Update", "Delete"],
      Properties: ["Read"],
      Analytics: ["Read"],
      Billing: [],
      Settings: ["Read"],
      Team: ["Read"],
      Documents: ["Create", "Read"],
    },
    Viewer: {
      Leads: ["Read"],
      Deals: ["Read"],
      Tasks: ["Read"],
      Properties: ["Read"],
      Analytics: ["Read"],
      Billing: [],
      Settings: [],
      Team: ["Read"],
      Documents: ["Read"],
    },
  };

  public static hasPermission(role: UserRole, domain: ResourceDomain, action: PermissionAction): boolean {
    const rolePermissions = this.permissionsMap[role];
    if (!rolePermissions) return false;
    const domainActions = rolePermissions[domain];
    if (!domainActions) return false;
    return domainActions.includes(action);
  }

  public static getRolePermissions(role: UserRole): Record<ResourceDomain, PermissionAction[]> {
    return this.permissionsMap[role] || ({} as Record<ResourceDomain, PermissionAction[]>);
  }
}
