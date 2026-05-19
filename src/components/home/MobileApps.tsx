import React from "react";
import Icon from "../layout/Icon";
import { APPS, createWhatsAppLink } from "@/lib/data";

export default function MobileApps() {
  return (
    <section id="apps" className="apps-section">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Vibe coding · Mobile</span>
          <h2>
            Apps we shipped with <span className="gradient-text">AI in the loop.</span>
          </h2>
          <p>Built end-to-end on an AI-paired workflow — from product spec to Play Store listing.</p>
        </div>

        <div className="apps-grid">
          {APPS.map((a, i) => (
            <div
              key={a.id}
              className="app-card glass glass-hover glow-border reveal"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <Phone screen={a.screen} image={a.image} accent={a.accent} />
              <div className="app-body">
                <div className="app-tag">{a.tag}</div>
                <h3>{a.name}</h3>
                <p>{a.desc}</p>
                {!a.placeholder && a.link ? (
                  <a className="play-badge" href={a.link} target="_blank" rel="noopener noreferrer" aria-label="Get it on Google Play">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M3.6 1.7c-.4.4-.6 1-.6 1.8v17c0 .8.2 1.4.6 1.8l.1.1L13 13.1v-.2L3.7 1.6l-.1.1zM16.8 16.4l-3.1-3.1-2.7 2.7 7.4 4.3c.9.5 1.6.1 1.6-.9 0-.5-.2-1-.6-1.4l-2.6-1.6zM16.8 7.6l2.6-1.6c.4-.4.6-.9.6-1.4 0-1-.7-1.4-1.6-.9L11 7.9l2.7 2.7 3.1-3z" />
                    </svg>
                    Get it on Google Play
                  </a>
                ) : (
                  <a
                    className="play-badge ghost"
                    href={createWhatsAppLink("Hi, I'd like early access / a white-label of your upcoming app.")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon name="wa" size={16} /> Request early access
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface PhoneProps {
  screen?: "terminal" | "stylist" | "soon";
  image?: string;
  accent: string;
}

function Phone({ screen, image, accent }: PhoneProps) {
  return (
    <div className="phone" style={{ "--phone-accent": accent } as React.CSSProperties}>
      <div className="phone-notch" />
      <div className="phone-screen" style={{ background: '#000' }}>
        {image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={image} alt="App Screenshot" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <>
            {screen === "terminal" && <TerminalScreen />}
            {screen === "stylist" && <StylistScreen />}
            {screen === "soon" && <SoonScreen />}
          </>
        )}
      </div>
      <div className="phone-bar" />
    </div>
  );
}

function TerminalScreen() {
  return (
    <div className="scr scr-term">
      <div className="scr-statusbar">
        <span>9:41</span>
        <span className="sb-r">●●●●</span>
      </div>
      <div className="term-head">
        <span>~/projects</span>
      </div>
      <div className="term-body">
        <div className="term-line">
          <span className="prompt">$</span> ai setup react-native
        </div>
        <div className="term-line out">→ Installing deps...</div>
        <div className="term-line out">→ Configuring Metro</div>
        <div className="term-line ok">✓ Project ready in 14s</div>
        <div className="term-line">
          <span className="prompt">$</span> _<span className="caret" />
        </div>
      </div>
    </div>
  );
}

function StylistScreen() {
  return (
    <div className="scr scr-style">
      <div className="scr-statusbar">
        <span>9:41</span>
        <span className="sb-r">●●●●</span>
      </div>
      <div className="style-head">
        <div className="avatar" />
        <div style={{ textAlign: "left" }}>
          <div className="style-hi">Hi, Aisha</div>
          <div className="style-sub">Today · 22° clear</div>
        </div>
      </div>
      <div className="style-card">
        <div className="style-img" />
        <div className="style-img s2" />
        <div className="style-img s3" />
      </div>
      <div className="style-pick">Today&apos;s pick · &quot;Soft minimal&quot;</div>
      <div className="style-btn">Save look</div>
    </div>
  );
}

function SoonScreen() {
  return (
    <div className="scr scr-soon">
      <div className="scr-statusbar">
        <span>9:41</span>
        <span className="sb-r">●●●●</span>
      </div>
      <div className="soon-mark">?</div>
      <div className="soon-label">Coming soon</div>
    </div>
  );
}
