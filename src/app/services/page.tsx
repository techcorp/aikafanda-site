import React from "react";
import Link from "next/link";
import Icon, { IconName } from "@/components/layout/Icon";
import { SERVICES, createWhatsAppLink } from "@/lib/data";

export const metadata = {
  title: "Services · AI ka Fanda",
  description: "Explore our core practices: custom AI agents, n8n automations, multi-agent systems, rapid SaaS MVPs, and vibe-coded websites.",
};

export default function ServicesPage() {
  return (
    <main>
      {/* HERO */}
      <section className="page-hero">
        <div className="container page-hero-inner">
          <span className="breadcrumb">
            <Link href="/">Home</Link> / Services
          </span>
          <span className="eyebrow">Our capabilities</span>
          <h1>
            Ship faster with <span className="gradient-text">intelligent workflows.</span>
          </h1>
          <p>
            We build custom AI layers that drop into your business without changing the tools your team already uses. Here is how we work.
          </p>
        </div>
      </section>

      {/* DETAIL LIST */}
      <section style={{ paddingTop: "24px" }}>
        <div className="container">
          <div className="services-detail">
            {SERVICES.map((s) => {
              return (
                <div
                  key={s.id}
                  id={s.id}
                  className="glass service-detail glow-border reveal"
                  style={{ scrollMarginTop: "120px" }}
                >
                  <div className="service-detail-left">
                    <span className="service-num">{s.num}</span>
                    <div className="service-detail-icon">
                      <Icon name={s.icon as IconName} size={24} />
                    </div>
                    <h2>{s.title}</h2>
                  </div>

                  <div className="service-detail-right">
                    {s.desc.map((p, pIdx) => (
                      <p key={pIdx}>{p}</p>
                    ))}

                    <div className="service-block">
                      <h4>Capabilities</h4>
                      <ul className="service-features">
                        {s.features.map((f, fIdx) => (
                          <li key={fIdx}>{f}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="service-block">
                      <h4>Example cases</h4>
                      <div className="service-cases">
                        {s.cases.map((c, cIdx) => (
                          <div key={cIdx} className="service-case">
                            <strong>{c.t}</strong>
                            <span>{c.d}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginTop: "24px" }}>
                      <a
                        href={createWhatsAppLink(`Hi, I'd like to get started with your service: ${s.title}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-wa"
                        style={{ display: "inline-flex", gap: "10px" }}
                      >
                        <Icon name="wa" size={18} />
                        Get Service
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card glass glow-border">
            <div className="cta-glow" />
            <div className="cta-copy">
              <span className="eyebrow">Ready to deploy?</span>
              <h2>Let&apos;s map a workflow.</h2>
              <p>
                Every project starts with a 15-minute diagnostic call. We map the target workflow, estimate token costs, and scope a first shippable slice.
              </p>
            </div>
            <div className="cta-actions">
              <Link className="btn btn-primary" href="/contact">
                Book scoping call <Icon name="arrow" size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
