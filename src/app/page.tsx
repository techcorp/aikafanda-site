import React from "react";
import Hero from "@/components/home/Hero";
import ServicesSection from "@/components/home/ServicesSection";
import ProjectsSection from "@/components/home/ProjectsSection";
import MobileApps from "@/components/home/MobileApps";
import WhyUs from "@/components/home/WhyUs";
import Testimonials from "@/components/home/Testimonials";
import CTA from "@/components/home/CTA";

export const metadata = {
  title: "Ai Ka Fanda · Agentic AI, Automation & Vibe Coding",
  description: "Bespoke AI Agent development, n8n workflow integrations, and rapid vibe-coded websites and SaaS builds. Karachi, Pakistan.",
};

export default function HomePage() {
  return (
    <main>
      <Hero />
      <ServicesSection />
      <ProjectsSection />
      <MobileApps />
      <WhyUs />
      <Testimonials />
      <CTA />
    </main>
  );
}
