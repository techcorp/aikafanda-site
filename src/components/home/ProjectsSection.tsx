import React from "react";
import Icon, { IconName } from "../layout/Icon";
import { PROJECTS, createWhatsAppLink } from "@/lib/data";

export default function ProjectsSection() {
  return (
    <section id="projects">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Live work</span>
          <h2>AI agents in action.</h2>
          <p>
            A selection of agents currently running in production for our clients. Each one replaced a recurring manual workflow.
          </p>
        </div>

        <div className="projects-grid">
          {PROJECTS.map((p, i) => {
            const link = p.placeholder
              ? createWhatsAppLink("Hi, I'd like to discuss a custom AI agent build.")
              : "#";
            return (
              <article
                key={p.id}
                className={`project-card glass glass-hover glow-border size-${p.size} ${
                  p.placeholder ? "is-placeholder" : ""
                } reveal`}
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <div className="project-visual" style={{ color: p.accent }}>
                  <ProjectVisual id={p.id} icon={p.icon as IconName} accent={p.accent} image={p.image} />
                </div>
                <div className="project-body">
                  <div className="project-tag" style={{ color: p.accent }}>
                    {p.tag}
                  </div>
                  <h3>{p.name}</h3>
                  <p>{p.desc}</p>
                  <div className="project-stack">
                    {p.stack.map((t) => (
                      <span key={t} className="tag mono">
                        {t}
                      </span>
                    ))}
                  </div>
                  <a
                    className="project-link"
                    href={link}
                    target={p.placeholder ? "_blank" : undefined}
                    rel={p.placeholder ? "noopener noreferrer" : undefined}
                  >
                    {p.placeholder ? "Claim this slot" : "View case study"}{" "}
                    <Icon name="arrow" size={14} />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

interface ProjectVisualProps {
  id: string;
  icon: IconName;
  accent: string;
  image?: string;
}

function ProjectVisual({ id, icon, accent, image }: ProjectVisualProps) {
  return (
    <div
      className="pv"
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        background: `radial-gradient(circle at center, ${accent}15 0%, transparent 70%), #070913`,
        overflow: "hidden",
      }}
    >
      {image ? (
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: "10px",
            overflow: "hidden",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 12px 32px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255,255,255,0.06)",
            background: "#030408",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={`Agent ${id}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top center",
              opacity: 0.95,
              transition: "transform 0.4s ease",
            }}
            className="pv-img"
          />
        </div>
      ) : (
        <svg className="pv-bg" viewBox="0 0 400 200" preserveAspectRatio="none">
          <defs>
            <pattern
              id={`stripe-${id}`}
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="8"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.18"
              />
            </pattern>
            <radialGradient id={`glow-${id}`}>
              <stop offset="0" stopColor={accent} stopOpacity="0.5" />
              <stop offset="1" stopColor={accent} stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="400" height="200" fill={`url(#stripe-${id})`} />
          <rect width="400" height="200" fill={`url(#glow-${id})`} />
        </svg>
      )}
      <div className="pv-icon" style={image ? { background: "rgba(11, 14, 28, 0.85)", backdropFilter: "blur(4px)" } : {}}>
        <Icon name={icon} size={28} />
      </div>
      <div className="pv-mono" style={image ? { background: "rgba(11, 14, 28, 0.85)", backdropFilter: "blur(4px)", padding: "4px 8px", borderRadius: "4px" } : {}}>
        <span className="dot" /> agent.{id} · running
      </div>
    </div>
  );
}
