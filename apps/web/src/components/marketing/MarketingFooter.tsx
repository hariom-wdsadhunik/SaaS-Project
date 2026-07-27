import React from "react";
import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 py-16 px-8 text-zinc-400 text-sm">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center font-bold text-white text-xs">
              L
            </div>
            <span className="font-bold text-white text-base">LeadPilot AI</span>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Intelligent CRM platform built for high-performance sales, real estate brokerages, and revenue teams.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Product</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/features" className="hover:text-white transition">AI Workspace</Link></li>
            <li><Link href="/features" className="hover:text-white transition">Workflow Engine</Link></li>
            <li><Link href="/features" className="hover:text-white transition">Analytics & BI</Link></li>
            <li><Link href="/pricing" className="hover:text-white transition">Pricing Plans</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Resources</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/dashboard" className="hover:text-white transition">Live CRM Portal</Link></li>
            <li><Link href="/api/v1/analytics" className="hover:text-white transition">API v1 Documentation</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Legal & Trust</h4>
          <ul className="space-y-2 text-xs">
            <li><span className="hover:text-white transition cursor-pointer">Privacy Policy</span></li>
            <li><span className="hover:text-white transition cursor-pointer">Terms of Service</span></li>
            <li><span className="hover:text-white transition cursor-pointer">Security Audit</span></li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-600">
        <p>© 2026 LeadPilot AI Inc. All rights reserved.</p>
        <p>Built with Next.js 15, Supabase & Design System v2.0.0.</p>
      </div>
    </footer>
  );
}
