import React from "react";
import Link from "next/link";
import Icon from "../layout/Icon";
import { createWhatsAppLink } from "@/lib/data";

export default function CTA() {
  const waLink = createWhatsAppLink("Hi, I'd like to discuss AI automation solutions for my business.");

  return (
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
            <a
              className="btn btn-wa"
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="wa" size={16} /> WhatsApp us
            </a>
            <Link className="btn btn-ghost" href="/contact">
              Contact form
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
