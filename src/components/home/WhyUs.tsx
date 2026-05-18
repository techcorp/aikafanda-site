"use client";

import React, { useState, useEffect, useRef } from "react";
import Icon, { IconName } from "../layout/Icon";
import { REASONS, STATS } from "@/lib/data";

export default function WhyUs() {
  return (
    <section id="why">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Why teams choose us</span>
          <h2>
            Built like an engineering team.
            <br />
            Priced like a partner.
          </h2>
        </div>

        <div className="why-grid">
          {REASONS.map((r, i) => (
            <div
              key={r.title}
              className="why-card glass reveal"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className="why-icon">
                <Icon name={r.icon as IconName} size={22} />
              </div>
              <h4>{r.title}</h4>
              <p>{r.desc}</p>
            </div>
          ))}
        </div>

        <div className="stats glass">
          {STATS.map((s) => (
            <Stat key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface StatProps {
  value: number;
  suffix: string;
  label: string;
}

function Stat({ value, suffix, label }: StatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          const dur = 1400;
          const start = performance.now();
          const tick = (t: number) => {
            const p = Math.min(1, (t - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            setN(Math.round(value * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return (
    <div className="stat" ref={ref}>
      <div className="stat-value gradient-text">
        {n.toLocaleString()}
        {suffix}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
