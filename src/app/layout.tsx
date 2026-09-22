import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { WhatsAppFab } from "@/components/ui/WhatsAppButton";
import ThemeTweaks from "@/components/ui/ThemeTweaks";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Ai Ka Fanda · Agentic AI, Automation & Vibe Coding",
  description:
    "Bespoke AI Agent development, n8n workflow integrations, and rapid vibe-coded websites and SaaS builds. Karachi, Pakistan.",
  icons: {
    icon: "/favicon-96x96.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-palette="violet-cyan" data-density="default" data-anim="on" suppressHydrationWarning>
      <head>
        <script async src="https://ds.mrmnd.com/b0f1a1c1-f0a4-4a41-8394-94b1d8151c24.js"></script>
        <script async src="https://ss.mrmnd.com/interstitial.js" data-mndintid="ff582398-b660-41df-b3d2-d3e2ed1a2db4"></script>
        <script async src="https://ss.mrmnd.com/static/6446df94-c447-4c2e-be18-42847a0b3b8e.js"></script>
      </head>
      <body suppressHydrationWarning>
        {/* Background Decorative Mesh, Grids, and Noise */}
        <div className="bg-mesh" aria-hidden="true">
          <div className="blob-1"></div>
          <div className="blob-2"></div>
          <div className="blob-3"></div>
        </div>
        <div className="bg-grid" aria-hidden="true"></div>
        <div className="bg-noise" aria-hidden="true"></div>

        {/* Global Navigation */}
        <Navbar />

        {/* Scroll Reveal Animation Manager */}
        <ScrollReveal />

        {/* Dynamic Pages */}
        {children}

        {/* Global Footer */}
        <Footer />

        {/* WhatsApp Floating Action Button */}
        <WhatsAppFab />

        {/* Theme customization tools panel */}
        <ThemeTweaks />
      </body>
    </html>
  );
}
