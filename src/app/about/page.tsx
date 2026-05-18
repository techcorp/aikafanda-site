import React from "react";
import Link from "next/link";
import { TECH_STACK, TEAM_MEMBERS, TIMELINE } from "@/lib/data";

export const metadata = {
  title: "About · AI ka Fanda",
  description: "A small studio building agentic AI, automation and vibe-coded products — for teams that move fast.",
};

export default function AboutPage() {
  return (
    <main>
      {/* HERO */}
      <section className="page-hero">
        <div className="container">
          <div className="about-hero-grid">
            <div className="page-hero-inner">
              <span className="breadcrumb">
                <Link href="/">Home</Link> / About
              </span>
              <span className="eyebrow">Who we are</span>
              <h1>
                A small studio
                <br />
                <span className="gradient-text">obsessed</span> with shipping useful AI.
              </h1>
              <p>
                We&apos;re an AI-native studio building agentic systems, automation, and vibe-coded products. We work with a handful of partners at a time so every engagement gets senior attention from start to finish.
              </p>
            </div>
            <div className="glass story-card glow-border">
              <span className="eyebrow">Mission</span>
              <p style={{ fontSize: "17px", color: "var(--fg)", lineHeight: "1.55" }}>
                Make AI useful for businesses that don&apos;t have an AI team — without the consulting markup or the science-fair theatre.
              </p>
              <div style={{ display: "flex", gap: "24px", marginTop: "18px", paddingTop: "18px", borderTop: "1px solid var(--border)" }}>
                <div>
                  <div className="story-stat gradient-text">2024</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--fg-dim)", letterSpacing: "0.1em", marginTop: "4px" }}>
                    FOUNDED
                  </div>
                </div>
                <div>
                  <div className="story-stat gradient-text">30+</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--fg-dim)", letterSpacing: "0.1em", marginTop: "4px" }}>
                    SHIPPED
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section>
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">What we believe</span>
            <h2>
              Three principles
              <br />
              we don&apos;t bend on.
            </h2>
          </div>
          <div className="values-grid">
            <div className="glass value-card">
              <span className="value-num">01</span>
              <h3>Ship beats perfect.</h3>
              <p>
                An agent in production beats a perfect roadmap. We optimise for the shortest path from &quot;interesting idea&quot; to &quot;running on real data&quot; — then iterate from there.
              </p>
            </div>
            <div className="glass value-card">
              <span className="value-num">02</span>
              <h3>Boring tech, sharp use.</h3>
              <p>
                We pick reliable, well-understood stacks (n8n, Next.js, Postgres) and apply AI surgically — not as a wrapper around everything. Less novelty, more leverage.
              </p>
            </div>
            <div className="glass value-card">
              <span className="value-num">03</span>
              <h3>Own your code.</h3>
              <p>
                Everything we build ships to your repos, your infra, your accounts. No black-box dependencies on us. Hire us for craft, not lock-in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* APPROACH */}
      <section>
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">How we work</span>
            <h2>
              Four steps. <span className="gradient-text">No waterfall.</span>
            </h2>
            <p>
              Every engagement runs on the same lightweight loop. You see something working at the end of week one, every time.
            </p>
          </div>
          <div className="glass" style={{ overflow: "hidden", borderRadius: "var(--radius-lg)" }}>
            <div className="approach-grid">
              <div className="approach-step">
                <h4>Scope &amp; map</h4>
                <p>15-min call. We map the workflow, identify the highest-leverage cut, and agree the first shippable slice.</p>
              </div>
              <div className="approach-step">
                <h4>Build &amp; preview</h4>
                <p>Within 5 working days, you see a real prototype on your real data. Not a slide deck — a thing that runs.</p>
              </div>
              <div className="approach-step">
                <h4>Harden &amp; deploy</h4>
                <p>We add observability, retries, human checkpoints, and ship to your infra. With docs your team can read.</p>
              </div>
              <div className="approach-step">
                <h4>Hand off (or stay)</h4>
                <p>Full handover with code review session. Optional retainer for ongoing iteration — your call.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TECH TOOLBOX */}
      <section>
        <div className="container">
          <div className="section-header center">
            <span className="eyebrow">Our toolbox</span>
            <h2>The stack we build on.</h2>
            <p>Battle-tested tools we know cold, plus the AI layer on top.</p>
          </div>
          <div className="tech-cloud">
            {TECH_STACK.map((t) => (
              <span key={t.name} className="tech-chip" data-tier={t.primary ? "primary" : undefined}>
                {t.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section>
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">People</span>
            <h2>Senior on every project.</h2>
            <p>No juniors leading the build. No army of subcontractors. You talk to the people writing the code.</p>
          </div>
          <div className="team-grid">
            {TEAM_MEMBERS.map((m) => (
              <div key={m.name} className="glass team-card glass-hover">
                <div className="team-avatar" style={{ background: m.accent }}>
                  {m.initials}
                </div>
                <h4>{m.name}</h4>
                <div className="team-role">{m.role}</div>
                <p style={{ fontSize: "13px", marginTop: "8px" }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section>
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Milestones</span>
            <h2>Where we&apos;ve been.</h2>
          </div>
          <div className="timeline">
            {TIMELINE.map((item) => (
              <div key={item.date} className="timeline-item">
                <span className="timeline-date">{item.date}</span>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card glass glow-border">
            <div className="cta-glow" />
            <div className="cta-copy">
              <span className="eyebrow">Let&apos;s build</span>
              <h2>Want to work with us?</h2>
              <p>
                We take on a small number of partners each quarter. If we&apos;re a fit, we&apos;ll tell you. If we&apos;re not, we&apos;ll tell you that too — and point you somewhere better.
              </p>
            </div>
            <div className="cta-actions">
              <Link className="btn btn-primary" href="/contact">
                Contact form
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
