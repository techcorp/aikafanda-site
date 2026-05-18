"use client";

import React, { useState } from "react";
import ContactForm from "./ContactForm";
import CalendarSlots from "./CalendarSlots";
import Icon from "../layout/Icon";
import { createWhatsAppLink } from "@/lib/data";

export default function ContactPageClient() {
  const [selectedSlot, setSelectedSlot] = useState("");

  const handleSelectSlot = (slotText: string) => {
    setSelectedSlot(slotText);
  };

  const waLink = createWhatsAppLink("Hi, I'd like to discuss AI automation solutions for my business.");

  return (
    <section style={{ paddingTop: "24px" }}>
      <div className="container">
        <div className="contact-grid">
          {/* FORM */}
          <ContactForm selectedSlot={selectedSlot} />

          {/* SIDE */}
          <aside className="contact-side">
            <a
              className="glass contact-card glass-hover glow-border"
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "linear-gradient(135deg, rgba(37,211,102,0.08), rgba(37,211,102,0.02))",
              }}
            >
              <div
                className="ico"
                style={{
                  background: "rgba(37,211,102,0.15)",
                  borderColor: "rgba(37,211,102,0.3)",
                  color: "#25D366",
                }}
              >
                <Icon name="wa" size={18} />
              </div>
              <span className="label">WhatsApp · fastest</span>
              <span style={{ fontSize: "17px", fontWeight: "500" }}>0317 7416164</span>
              <span style={{ fontSize: "13px", color: "var(--fg-muted)" }}>
                Usually replies within the hour.
              </span>
            </a>

            <div className="glass contact-card glass-hover glow-border">
              <div className="ico">
                <Icon name="chat" size={18} />
              </div>
              <span className="label">Email</span>
              <a href="mailto:technicalcorp700@gmail.com" style={{ fontSize: "17px" }}>
                technicalcorp700@gmail.com
              </a>
              <span style={{ fontSize: "13px", color: "var(--fg-muted)" }}>
                For longer briefs and attachments.
              </span>
            </div>

            <div className="glass contact-card glass-hover glow-border">
              <div className="ico">
                <Icon name="cube" size={18} />
              </div>
              <span className="label">Studio</span>
              <span style={{ fontSize: "15px", fontWeight: "500" }}>Karachi, Pakistan</span>
              <span style={{ fontSize: "13px", color: "var(--fg-muted)" }}>
                Mon–Fri · 10:00–19:00 PKT
              </span>
            </div>

            <div className="glass contact-card glass-hover glow-border">
              <span className="label">Follow us</span>
              <div className="social-grid" style={{ marginTop: "4px" }}>
                <a className="social-link" href="#" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
                <a className="social-link" href="#" target="_blank" rel="noopener noreferrer">
                  X / Twitter
                </a>
                <a className="social-link" href="#" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
                <a className="social-link" href="#" target="_blank" rel="noopener noreferrer">
                  YouTube
                </a>
              </div>
            </div>

            {/* CALENDAR MOCK */}
            <CalendarSlots onSelectSlot={handleSelectSlot} />
          </aside>
        </div>
      </div>
    </section>
  );
}
