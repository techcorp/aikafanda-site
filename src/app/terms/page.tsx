import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions · AI ka Fanda",
  description: "Read our terms of service, engagement conditions, and delivery definitions.",
};

export default function TermsPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container page-hero-inner">
          <span className="breadcrumb">
            <Link href="/">Home</Link> / Terms &amp; Conditions
          </span>
          <span className="eyebrow">Legal documentation</span>
          <h1>Terms &amp; Conditions</h1>
          <p>Last updated: May 18, 2026</p>
        </div>
      </section>

      <section style={{ paddingTop: "24px", paddingBottom: "80px" }}>
        <div className="container">
          <div className="glass glow-border legal-card">
            <h2 style={{ fontSize: "22px", marginBottom: "16px", color: "var(--accent)" }}>1. Services Scope</h2>
            <p style={{ marginBottom: "24px" }}>
              Ai Ka Fanda provides custom AI agent development, n8n workflow automation implementations, vibe coding websites, and SaaS product engineering. The specific scope, timeline, deliverables, and fees for each engagement will be detailed in an independent project agreement.
            </p>

            <h2 style={{ fontSize: "22px", marginBottom: "16px", color: "var(--accent)" }}>2. Client Responsibilities</h2>
            <p style={{ marginBottom: "24px" }}>
              To ensure timely delivery, clients must provide necessary API keys, workflow documentation, domain accesses, and feedback on milestones within the agreed-upon review cycles. Delay in providing these assets may impact overall delivery timelines.
            </p>

            <h2 style={{ fontSize: "22px", marginBottom: "16px", color: "var(--accent)" }}>3. Code Delivery and Handover</h2>
            <p style={{ marginBottom: "24px" }}>
              Upon successful completion of project milestones and full settlement of invoice fees, full ownership of all custom source code, assets, and configurations developed during the scope will be handed over to the client. Ai Ka Fanda does not retain any intellectual property rights or licensing fees unless explicitly agreed.
            </p>

            <h2 style={{ fontSize: "22px", marginBottom: "16px", color: "var(--accent)" }}>4. Maintenance and Support</h2>
            <p style={{ marginBottom: "24px" }}>
              All projects include 30 days of active post-deploy bug fixing and monitoring. Extended maintenance agreements and continuous model-optimization retainers can be scheduled as separate line items.
            </p>

            <h2 style={{ fontSize: "22px", marginBottom: "16px", color: "var(--accent)" }}>5. Governing Law</h2>
            <p style={{ marginBottom: "24px" }}>
              These terms are governed by and construed in accordance with the laws of Pakistan. Any dispute arising out of or related to our services shall be subject to the exclusive jurisdiction of the competent courts in Karachi, Pakistan.
            </p>

            <h2 style={{ fontSize: "22px", marginBottom: "16px", color: "var(--accent)" }}>6. Questions</h2>
            <p>
              If you have any questions or require clarification on these Terms &amp; Conditions, please email us at{" "}
              <a href="mailto:technicalcorp700@gmail.com" style={{ color: "var(--primary)", textDecoration: "underline" }}>
                technicalcorp700@gmail.com
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
