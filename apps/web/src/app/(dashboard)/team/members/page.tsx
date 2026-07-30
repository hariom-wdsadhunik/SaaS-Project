"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TeamMember, UserRole } from "@/domain/organization/OrganizationTypes";
import { UserCheck, Search, UserPlus, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function TeamMembersPage() {
  const [query, setQuery] = React.useState("");
  const [members, setMembers] = React.useState<TeamMember[]>([
    {
      id: "usr-1",
      organizationId: "org-1",
      fullName: "Alex Morgan",
      email: "alex@leadpilot.ai",
      role: "Owner",
      status: "ACTIVE",
      onlineStatus: "ONLINE",
      lastLoginAt: "2026-07-30T10:00:00.000Z",
      joinedAt: "2025-01-15",
    },
    {
      id: "usr-2",
      organizationId: "org-1",
      fullName: "Sarah Jenkins",
      email: "sarah@leadpilot.ai",
      role: "Manager",
      status: "ACTIVE",
      onlineStatus: "ONLINE",
      lastLoginAt: "2026-07-30T09:40:00.000Z",
      joinedAt: "2025-03-01",
    },
    {
      id: "usr-3",
      organizationId: "org-1",
      fullName: "Marcus Vance",
      email: "marcus@leadpilot.ai",
      role: "Agent",
      status: "ACTIVE",
      onlineStatus: "AWAY",
      lastLoginAt: "2026-07-30T07:00:00.000Z",
      joinedAt: "2025-05-10",
    },
  ]);

  const filteredMembers = members.filter(
    (m) =>
      m.fullName.toLowerCase().includes(query.toLowerCase()) ||
      m.email.toLowerCase().includes(query.toLowerCase()) ||
      m.role.toLowerCase().includes(query.toLowerCase())
  );

  const handleRoleChange = (id: string, newRole: UserRole) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, role: newRole } : m))
    );
    toast.success(`Updated role to ${newRole}`);
  };

  const handleToggleDeactivate = (id: string, currentStatus: TeamMember["status"]) => {
    const nextStatus: TeamMember["status"] = currentStatus === "ACTIVE" ? "DEACTIVATED" : "ACTIVE";
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: nextStatus } : m))
    );
    toast.info(`Member status set to ${nextStatus}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-zinc-800/80 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/team">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Team
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <UserCheck className="w-6 h-6 text-emerald-400" />
              Team Members &amp; Roles
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Manage organization users, role assignments, and activation status
            </p>
          </div>
        </div>

        <Link href="/team/invitations">
          <Button variant="primary" size="sm">
            <UserPlus className="w-4 h-4 mr-2" /> Invite New Member
          </Button>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4 bg-zinc-900/80 border border-zinc-800 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search members by name, email, or role..."
            className="pl-9"
          />
        </div>
        <Badge variant="blue">{filteredMembers.length} Members Found</Badge>
      </Card>

      {/* Members Table */}
      <Card className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4">
        <div className="divide-y divide-zinc-800/80">
          {filteredMembers.map((m) => (
            <div key={m.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-semibold text-white">
                  {m.fullName[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white">{m.fullName}</p>
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        m.onlineStatus === "ONLINE"
                          ? "bg-emerald-400"
                          : m.onlineStatus === "AWAY"
                          ? "bg-amber-400"
                          : "bg-zinc-600"
                      }`}
                      title={m.onlineStatus}
                    />
                  </div>
                  <p className="text-xs text-zinc-400">{m.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <select
                  value={m.role}
                  onChange={(e) => handleRoleChange(m.id, e.target.value as UserRole)}
                  className="bg-zinc-950 text-xs font-medium text-white border border-zinc-800 rounded-lg px-2.5 py-1.5 focus:outline-none"
                >
                  <option value="Owner">Owner</option>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Agent">Agent</option>
                  <option value="Viewer">Viewer</option>
                </select>

                <Badge variant={m.status === "ACTIVE" ? "emerald" : "rose"}>
                  {m.status}
                </Badge>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleDeactivate(m.id, m.status)}
                >
                  {m.status === "ACTIVE" ? "Deactivate" : "Activate"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
