"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TeamInvitation, UserRole } from "@/domain/organization/OrganizationTypes";
import { UserPlus, ArrowLeft, Send, RefreshCw, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function TeamInvitationsPage() {
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [inviteRole, setInviteRole] = React.useState<UserRole>("Agent");
  const [invitations, setInvitations] = React.useState<TeamInvitation[]>([
    {
      id: "inv-101",
      organizationId: "org-1",
      email: "david.miller@apex.com",
      role: "Agent",
      invitedBy: "Alex Morgan",
      invitedAt: "2026-07-29T12:00:00.000Z",
      expiresAt: "2026-08-05T12:00:00.000Z",
      status: "PENDING",
    },
    {
      id: "inv-102",
      organizationId: "org-1",
      email: "rachel.green@apex.com",
      role: "Manager",
      invitedBy: "Alex Morgan",
      invitedAt: "2026-07-28T12:00:00.000Z",
      expiresAt: "2026-08-04T12:00:00.000Z",
      status: "PENDING",
    },
  ]);

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    const newInv: TeamInvitation = {
      id: `inv-${Date.now()}`,
      organizationId: "org-1",
      email: inviteEmail,
      role: inviteRole,
      invitedBy: "Alex Morgan",
      invitedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
      status: "PENDING",
    };

    setInvitations((prev) => [newInv, ...prev]);
    setInviteEmail("");
    toast.success(`Invitation sent to ${inviteEmail} as ${inviteRole}`);
  };

  const handleResend = (email: string) => {
    toast.info(`Resent invitation email to ${email}`);
  };

  const handleRevoke = (id: string) => {
    setInvitations((prev) => prev.filter((i) => i.id !== id));
    toast.warning("Invitation revoked");
  };

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
              <UserPlus className="w-6 h-6 text-blue-400" />
              Team Invitations
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Invite new colleagues and manage pending organization invitations
            </p>
          </div>
        </div>
      </div>

      {/* Invite Form Card */}
      <Card className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <Send className="w-4 h-4 text-blue-400" /> Send New Invitation
        </h2>

        <form onSubmit={handleSendInvite} className="flex flex-col sm:flex-row items-end gap-4">
          <div className="flex-1 space-y-1.5 w-full">
            <label className="text-xs font-medium text-zinc-300">Recipient Email</label>
            <Input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="colleague@company.com"
              required
            />
          </div>

          <div className="w-full sm:w-48 space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">Assign Role</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as UserRole)}
              className="w-full bg-zinc-950 text-xs font-medium text-white border border-zinc-800 rounded-lg px-3 py-2 focus:outline-none"
            >
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Agent">Agent</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>

          <Button type="submit" variant="primary">
            <Send className="w-4 h-4 mr-2" /> Send Invitation
          </Button>
        </form>
      </Card>

      {/* Pending Invitations List */}
      <Card className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h2 className="text-base font-semibold text-white">Pending Invitations ({invitations.length})</h2>
        </div>

        <div className="divide-y divide-zinc-800/80">
          {invitations.map((inv) => (
            <div key={inv.id} className="py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">{inv.email}</p>
                <p className="text-xs text-zinc-400">Invited by {inv.invitedBy} as <strong className="text-zinc-300">{inv.role}</strong></p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="amber">{inv.status}</Badge>
                <Button variant="outline" size="sm" onClick={() => handleResend(inv.email)}>
                  <RefreshCw className="w-3.5 h-3.5 mr-1" /> Resend
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleRevoke(inv.id)}>
                  <XCircle className="w-3.5 h-3.5 text-rose-400" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
