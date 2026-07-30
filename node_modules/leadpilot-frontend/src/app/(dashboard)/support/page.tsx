"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { HelpCenterService } from "@/platform/support/HelpCenterService";
import { TicketService } from "@/platform/support/TicketService";

export default function SupportDashboardPage() {
  const [query, setQuery] = useState("");
  const helpService = new HelpCenterService();
  const ticketService = new TicketService();

  const articles = helpService.searchArticles(query);
  const categories = helpService.getCategories();
  const tickets = ticketService.getTickets("org_default");

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center border-b border-zinc-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Customer Success & Help Center</h1>
            <p className="text-xs text-zinc-400">Knowledge base articles, support ticket tracking, and feedback.</p>
          </div>
          <Badge variant="emerald">24/7 SLA Active</Badge>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search help articles, AI copilot guides, workflow setup..."
            className="pl-4 py-3 bg-zinc-900 border-zinc-800 text-base"
          />
        </div>

        {/* Category Browser */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Card key={cat.id} className="p-4 hover:border-blue-500/50 transition cursor-pointer">
              <span className="font-bold text-sm text-white block mb-1">{cat.name}</span>
              <span className="text-xs text-zinc-500">Explore guides →</span>
            </Card>
          ))}
        </div>

        {/* Knowledge Articles */}
        <Card className="space-y-4">
          <h3 className="text-base font-bold text-white">Popular Help Articles</h3>
          <div className="space-y-3">
            {articles.map((art) => (
              <div key={art.id} className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-sm text-white">{art.title}</h4>
                  <p className="text-xs text-zinc-400">{art.content}</p>
                </div>
                <Badge variant="zinc">{art.helpfulCount} 👍</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Open Support Tickets */}
        <Card className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-white">Your Support Tickets</h3>
            <Button variant="primary" size="sm">
              + New Ticket
            </Button>
          </div>
          <div className="space-y-3">
            {tickets.map((tkt) => (
              <div key={tkt.id} className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm text-white">{tkt.subject}</span>
                  <Badge variant={tkt.status === "open" ? "blue" : "emerald"}>{tkt.status}</Badge>
                </div>
                <p className="text-xs text-zinc-400">{tkt.description}</p>
                <div className="flex justify-between text-[10px] text-zinc-500 pt-1">
                  <span>Assigned Agent: {tkt.assignedAgent}</span>
                  <span>Priority: {tkt.priority}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
