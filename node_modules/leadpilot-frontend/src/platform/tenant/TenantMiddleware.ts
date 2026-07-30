import { NextResponse } from "next/server";
import { TenantContext } from "./TenantContext";

export class TenantMiddleware {
  public static validateTenantAccess(request: Request): NextResponse | null {
    const orgIdHeader = request.headers.get("x-organization-id");
    const currentOrgId = TenantContext.getOrganizationId();

    if (orgIdHeader && orgIdHeader !== currentOrgId) {
      return NextResponse.json(
        { success: false, error: "Access Denied: Tenant boundary violation" },
        { status: 403 }
      );
    }

    return null;
  }
}
