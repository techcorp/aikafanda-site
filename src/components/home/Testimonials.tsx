"use client";

import React, { useState, useEffect } from "react";
import Icon from "../layout/Icon";
import { QUOTES } from "@/lib/data";

export default function Testimonials() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % QUOTES.length), 7000);
    return () => clearInterval(t);
  }, []);

  const q = QUOTES[i];

  return (
    <section id="testimonials">
      <div className="container">
        <div className="section-header center">
          <span className="eyebrow">Word of mouth</span>
          <h2>What partners say.</h2>
        </div>

        <div className="testimonial glass glow-border">
          <div className="t-stars">
            {[0, 1, 2, 3, 4].map((s) => (
              <Icon key={s} name="star" size={16} />
            ))}
          </div>
          <blockquote key={i}>&quot;{q.q}&quot;</blockquote>
          <div className="t-attr">
            <div className="t-avatar" aria-hidden="true">
              {q.name
                .split(" ")
                .map((s) => s[0])
                .join("")}
            </div>
            <div style={{ textAlign: "left" }}>
              <div className="t-name">{q.name}</div>
              <div className="t-role">{q.role}</div>
            </div>
          </div>
          <div className="t-dots">
            {QUOTES.map((_, idx) => (
              <button
                key={idx}
                className={`t-dot ${idx === i ? "active" : ""}`}
                onClick={() => setI(idx)}
                aria-label={`Quote ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="logos">
          {["LUMEN", "KARAVAN", "THREADLY", "NORTHWIND", "BAYAAN", "ALCOVE"].map((l) => (
            <div key={l} className="logo-pill">
              {l}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
