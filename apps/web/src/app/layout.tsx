import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/providers/app-providers";

export const metadata: Metadata = {
  title: "LeadPilot AI CRM — Enterprise Sales & Real Estate Platform",
  description: "Modern AI-powered CRM for brokers, sales teams, and agencies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased bg-zinc-950 text-zinc-100 font-sans">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
