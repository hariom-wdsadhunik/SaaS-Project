"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RBACEngine } from "@/domain/organization/RBACEngine";
import { UserRole, ResourceDomain, PermissionAction } from "@/domain/organization/OrganizationTypes";
import { Shield, ArrowLeft, Check, X } from "lucide-react";

export default function TeamRolesPage() {
  const roles: UserRole[] = ["Owner", "Admin", "Manager", "Agent", "Viewer"];
  const domains: ResourceDomain[] = [
    "Leads",
    "Deals",
    "Tasks",
    "Properties",
    "Analytics",
    "Billing",
    "Settings",
    "Team",
    "Documents",
  ];
  const actions: PermissionAction[] = ["Create", "Read", "Update", "Delete", "Export", "Assign"];

  const [selectedRole, setSelectedRole] = React.useState<UserRole>("Manager");

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-zinc-800/80 pb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/team">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Team
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Shield className="w-6 h-6 text-indigo-400" />
              Role-Based Access Control (RBAC) Matrix
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Centralized permission definitions across 5 roles and 9 resource domains
            </p>
          </div>
        </div>
      </div>

      {/* Role Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {roles.map((r) => (
          <Button
            key={r}
            variant={selectedRole === r ? "primary" : "outline"}
            size="sm"
            onClick={() => setSelectedRole(r)}
          >
            {r} Role
          </Button>
        ))}
      </div>

      {/* Permissions Matrix Table */}
      <Card className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h2 className="text-base font-semibold text-white">
            Permission Matrix for <span className="text-indigo-400 font-bold">{selectedRole}</span>
          </h2>
          <Badge variant="blue">Centralized Security Policy</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3">Resource Domain</th>
                {actions.map((act) => (
                  <th key={act} className="py-2.5 px-3 text-center">{act}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {domains.map((dom) => (
                <tr key={dom} className="hover:bg-zinc-800/40">
                  <td className="py-3 px-3 font-semibold text-white">{dom}</td>
                  {actions.map((act) => {
                    const has = RBACEngine.hasPermission(selectedRole, dom, act);
                    return (
                      <td key={act} className="py-3 px-3 text-center">
                        {has ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-zinc-800 text-zinc-600">
                            <X className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
