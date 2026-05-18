import React from "react";
import Link from "next/link";
import Icon, { IconName } from "../layout/Icon";

const SERVICES_PREVIEW = [
  {
    id: "service-1",
    icon: "bot" as IconName,
    title: "AI Agents Development",
    desc: "Custom intelligent agents that reason, act, and integrate with your existing tools — from inbox triage to deal-room copilots.",
    tags: ["LangChain", "OpenAI", "Claude"],
  },
  {
    id: "service-2",
    icon: "network" as IconName,
    title: "Agentic AI Services",
    desc: "Multi-agent systems that plan, delegate, and complete multi-step workflows autonomously — with humans in the loop where it matters.",
    tags: ["CrewAI", "AutoGen", "MCP"],
  },
  {
    id: "service-3",
    icon: "code" as IconName,
    title: "Vibe Coding Websites",
    desc: "AI-paired web development. Production sites shipped in days, not months — without sacrificing craft or performance.",
    tags: ["Next.js", "Tailwind", "Cloudflare"],
  },
  {
    id: "service-4",
    icon: "layers" as IconName,
    title: "Vibe Coding SaaS",
    desc: "Bespoke SaaS products built end-to-end with an AI-augmented workflow — auth, billing, and dashboards included.",
    tags: ["Supabase", "Stripe", "Vercel"],
  },
];

export default function ServicesSection() {
  return (
    <section id="services">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">What we build</span>
          <h2>
            Four practices, one outcome — <span className="gradient-text">leverage.</span>
          </h2>
          <p>
            We focus on a tight set of capabilities so we can ship them exceptionally well. Pick a practice or compose them into a custom engagement.
          </p>
        </div>

        <div className="services-grid">
          {SERVICES_PREVIEW.map((s, i) => (
            <Link
              key={s.id}
              href={`/services#${s.id}`}
              className="service-card glass glass-hover glow-border reveal"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className="service-icon">
                <Icon name={s.icon} size={22} />
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <div className="service-tags">
                {s.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
              <span className="service-link">
                Learn more <Icon name="arrow" size={14} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
