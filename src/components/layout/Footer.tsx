import React from "react";
import Link from "next/link";
import Image from "next/image";
import Icon from "./Icon";
import { createWhatsAppLink } from "@/lib/data";

export default function Footer() {
  const waLink = createWhatsAppLink("Hi, I'd like to discuss AI automation solutions for my business.");

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link href="/" className="brand" aria-label="Home page">
              <Image
                src="/aikafanda.png"
                alt="AI ka Fanda"
                width={140}
                height={44}
                className="brand-logo"
                style={{ width: "auto", height: "auto" }}
              />
            </Link>
            <p style={{ marginTop: 16, maxWidth: 320 }}>
              Agentic AI, automation and vibe coding — built for teams that move fast.
            </p>
            <div className="footer-contact">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="wa" size={14} /> 0317 7416164
              </a>
              <a href="mailto:technicalcorp700@gmail.com">technicalcorp700@gmail.com</a>
            </div>
          </div>
          <div>
            <h4>Services</h4>
            <ul>
              <li>
                <Link href="/services#service-1">AI Agents</Link>
              </li>
              <li>
                <Link href="/services#service-2">Agentic AI</Link>
              </li>
              <li>
                <Link href="/services#service-3">Vibe Coding · Web</Link>
              </li>
              <li>
                <Link href="/services#service-4">Vibe Coding · SaaS</Link>
              </li>
              <li>
                <Link href="/services#service-5">n8n Workflows</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/#projects">Work</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Connect</h4>
            <ul>
              <li>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://x.com" target="_blank" rel="noopener noreferrer">
                  X / Twitter
                </a>
              </li>
              <li>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                  YouTube
                </a>
              </li>
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div style={{ display: "flex", gap: "16px" }}>
            <span>© 2026 Ai Ka Fanda</span>
            <span>·</span>
            <Link href="/privacy-policy" style={{ color: "var(--fg-dim)", transition: "color .2s" }}>
              Privacy Policy
            </Link>
            <span>·</span>
            <Link href="/terms" style={{ color: "var(--fg-dim)", transition: "color .2s" }}>
              Terms & Conditions
            </Link>
          </div>
          <span>Made with intent · Karachi</span>
        </div>
      </div>
    </footer>
  );
}
