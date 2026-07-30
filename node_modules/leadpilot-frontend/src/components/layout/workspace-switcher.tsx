"use client";

import * as React from "react";
import { Building, ChevronDown, Check, Plus } from "lucide-react";
import { Organization } from "@/domain/organization/OrganizationTypes";
import { toast } from "sonner";

export function WorkspaceSwitcher() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [organizations] = React.useState<Organization[]>([
    {
      id: "org-1",
      name: "LeadPilot Advisory Group",
      slug: "leadpilot-advisory",
      timezone: "America/New_York",
      subscriptionPlan: "Enterprise Pro",
      ownerId: "usr-1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "org-2",
      name: "Apex Luxury Real Estate",
      slug: "apex-luxury",
      timezone: "Europe/London",
      subscriptionPlan: "Growth Tier",
      ownerId: "usr-1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);
  const [activeOrgId, setActiveOrgId] = React.useState("org-1");

  const activeOrg = organizations.find((o) => o.id === activeOrgId) || organizations[0];

  const handleSelectOrg = (id: string, name: string) => {
    setActiveOrgId(id);
    setIsOpen(false);
    toast.success(`Switched active workspace to ${name}`);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors text-left"
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-7 h-7 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <Building className="w-4 h-4" />
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold text-white truncate">{activeOrg.name}</p>
            <p className="text-[10px] text-zinc-500 font-mono truncate">{activeOrg.subscriptionPlan}</p>
          </div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0 ml-1" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-full rounded-xl border border-zinc-800 bg-zinc-900 p-1.5 shadow-2xl z-50 animate-in fade-in duration-100 space-y-1">
          <div className="px-2.5 py-1 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
            Switch Workspace
          </div>
          {organizations.map((org) => (
            <button
              key={org.id}
              onClick={() => handleSelectOrg(org.id, org.name)}
              className="flex items-center justify-between w-full px-2.5 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <span className="truncate">{org.name}</span>
              {org.id === activeOrgId && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
            </button>
          ))}

          <div className="pt-1 border-t border-zinc-800/80">
            <button
              onClick={() => {
                setIsOpen(false);
                toast.info("Create New Organization Modal");
              }}
              className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-xs text-blue-400 hover:bg-blue-500/10 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Organization</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
