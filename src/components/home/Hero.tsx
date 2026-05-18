"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Icon from "../layout/Icon";

export default function Hero() {

  // Add scroll-trigger setup
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-copy">
          <span className="eyebrow">Agentic AI · Automation · Vibe Coding</span>
          <h1>
            Transform your business with <span className="gradient-text">intelligent AI automation</span>
          </h1>
          <p className="hero-sub">
            We design, build and deploy autonomous AI agents and bespoke automation systems that compound your team&apos;s output — quietly, reliably, and on your stack.
          </p>
          <div className="hero-ctas">
            <Link className="btn btn-primary" href="/services">
              Explore services <Icon name="arrow" size={16} />
            </Link>
            <a className="btn btn-ghost" href="#projects">
              <Icon name="play" size={14} /> View our work
            </a>
          </div>
          <div className="hero-meta">
            <div className="hero-meta-item">
              <strong>30+</strong>
              <span>Automations shipped</span>
            </div>
            <div className="divider" />
            <div className="hero-meta-item">
              <strong>n8n · LangChain · OpenAI</strong>
              <span>Production stack</span>
            </div>
            <div className="divider" />
            <div className="hero-meta-item">
              <strong>24/7</strong>
              <span>Agents on the clock</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <FloatingCards />
        </div>
      </div>
    </section>
  );
}

function FloatingCards() {
  return (
    <div className="float-stack">
      {/* Sales Pipeline Agent Card */}
      <div className="float-card f1 glass">
        <div className="fc-head">
          <span className="fc-dot" style={{ background: "var(--accent)" }} />
          <span className="fc-title">sales-pipeline.agent</span>
          <span className="fc-status">running</span>
        </div>
        <div className="fc-body">
          <div className="fc-line">
            <span>08:01</span> Qualified 14 new leads
          </div>
          <div className="fc-line">
            <span>08:02</span> Drafted follow-up emails
          </div>
          <div className="fc-line">
            <span>08:03</span> Updated CRM · 14 records
          </div>
          <div className="fc-line active">
            <span>08:03</span> 3 meetings booked ✓
          </div>
        </div>
      </div>

      {/* AI Support Chat Card */}
      <div className="float-card f2 glass">
        <div className="fc-pill">
          <Icon name="bot" size={14} /> AI Support Agent
        </div>
        <div className="fc-chat">
          <div className="bubble in">Where&apos;s my order? It&apos;s been 3 days.</div>
          <div className="bubble out">
            Your order #4821 shipped today and arrives by Thursday — I&apos;ve sent the tracking link to your email.
          </div>
        </div>
      </div>

      {/* Time Saved Metric Card */}
      <div className="float-card f3 glass">
        <div className="fc-metric">
          <div className="fc-metric-label">Hours saved this week</div>
          <div className="fc-metric-value gradient-text">847</div>
          <div className="fc-spark">
            <svg viewBox="0 0 100 30" preserveAspectRatio="none">
              <defs>
                <linearGradient id="sp" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="var(--primary)" stopOpacity="0.6" />
                  <stop offset="1" stopColor="var(--primary)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,24 L10,20 L22,22 L34,14 L46,17 L58,9 L70,12 L82,4 L100,6 L100,30 L0,30 Z"
                fill="url(#sp)"
              />
              <path
                d="M0,24 L10,20 L22,22 L34,14 L46,17 L58,9 L70,12 L82,4 L100,6"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="float-orbit">
        <span className="orbit-dot d1" />
        <span className="orbit-dot d2" />
        <span className="orbit-dot d3" />
      </div>
    </div>
  );
}
