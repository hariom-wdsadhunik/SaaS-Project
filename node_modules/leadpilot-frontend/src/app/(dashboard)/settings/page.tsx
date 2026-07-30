"use client";

import * as React from "react";
import { useAuthContext } from "@/lib/auth/auth-provider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import { Settings, User, Building, Bell, Shield, Key, Moon, Sun, Monitor, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useAuthContext();
  const { theme, setTheme } = useTheme();

  const [fullName, setFullName] = React.useState(user?.fullName || "LeadPilot Admin");
  const [email, setEmail] = React.useState(user?.email || "admin@leadpilot.ai");
  const [orgName, setOrgName] = React.useState("LeadPilot Advisory Group");
  const [currency, setCurrency] = React.useState("USD ($)");
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Profile and workspace settings updated successfully!");
    }, 600);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-zinc-800/80 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-400" />
          Settings &amp; Workspace Preferences
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Manage your user profile, organization preferences, theme, and API key integrations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Navigation Column */}
        <div className="lg:col-span-3 space-y-2">
          <Card className="p-3 bg-zinc-900/60 border border-zinc-800 space-y-1">
            <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-white bg-blue-500/10 border border-blue-500/20">
              <User className="h-4 w-4 text-blue-400" />
              <span>User Profile</span>
            </button>
            <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors">
              <Building className="h-4 w-4 text-zinc-400" />
              <span>Organization &amp; Workspace</span>
            </button>
            <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors">
              <Bell className="h-4 w-4 text-zinc-400" />
              <span>Notifications</span>
            </button>
            <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors">
              <Shield className="h-4 w-4 text-zinc-400" />
              <span>Security &amp; RBAC</span>
            </button>
            <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors">
              <Key className="h-4 w-4 text-zinc-400" />
              <span>API Keys &amp; Webhooks</span>
            </button>
          </Card>
        </div>

        {/* Main Settings Form */}
        <div className="lg:col-span-9 space-y-6">
          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* User Profile Card */}
            <Card className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-400" /> User Profile Information
                </h2>
                <Badge variant="emerald">Admin Authorized</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Full Name</label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Email Address</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                  />
                </div>
              </div>
            </Card>

            {/* Organization Settings */}
            <Card className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <Building className="w-4 h-4 text-emerald-400" /> Workspace Preferences
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Organization Name</label>
                  <Input
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="Organization Name"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Default Currency</label>
                  <Input
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    placeholder="USD ($)"
                  />
                </div>
              </div>
            </Card>

            {/* Appearance & Theme System */}
            <Card className="p-6 bg-zinc-900/80 border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-violet-400" /> Theme &amp; Visual Appearance
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={`p-4 rounded-xl border flex flex-col items-center gap-2 text-xs font-medium transition-all ${
                    theme === "dark"
                      ? "bg-blue-500/10 border-blue-500 text-blue-400 shadow-sm"
                      : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  <Moon className="w-5 h-5 text-indigo-400" />
                  <span>Dark Mode</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={`p-4 rounded-xl border flex flex-col items-center gap-2 text-xs font-medium transition-all ${
                    theme === "light"
                      ? "bg-blue-500/10 border-blue-500 text-blue-400 shadow-sm"
                      : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  <Sun className="w-5 h-5 text-amber-400" />
                  <span>Light Mode</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme("system")}
                  className={`p-4 rounded-xl border flex flex-col items-center gap-2 text-xs font-medium transition-all ${
                    theme === "system"
                      ? "bg-blue-500/10 border-blue-500 text-blue-400 shadow-sm"
                      : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  <Monitor className="w-5 h-5 text-zinc-400" />
                  <span>System Theme</span>
                </button>
              </div>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button type="submit" variant="primary" disabled={isSaving}>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                {isSaving ? "Saving Settings..." : "Save Settings"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
