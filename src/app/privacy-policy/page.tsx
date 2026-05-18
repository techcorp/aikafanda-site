import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy · AI ka Fanda",
  description: "Learn how we handle and protect your personal and project information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container page-hero-inner">
          <span className="breadcrumb">
            <Link href="/">Home</Link> / Privacy Policy
          </span>
          <span className="eyebrow">Legal documentation</span>
          <h1>Privacy Policy</h1>
          <p>Last updated: May 18, 2026</p>
        </div>
      </section>

      <section style={{ paddingTop: "24px", paddingBottom: "80px" }}>
        <div className="container">
          <div className="glass glow-border legal-card">
            <h2 style={{ fontSize: "22px", marginBottom: "16px", color: "var(--accent)" }}>1. Information We Collect</h2>
            <p style={{ marginBottom: "24px" }}>
              We collect information that you voluntarily provide when you submit a contact form on our website or contact us via email, WhatsApp, or other communication channels. This information may include your name, email address, phone number, and any details regarding your project that you share.
            </p>

            <h2 style={{ fontSize: "22px", marginBottom: "16px", color: "var(--accent)" }}>2. How We Use Your Information</h2>
            <p style={{ marginBottom: "24px" }}>
              We use the collected information solely to understand your project requirements, communicate with you, provide quotes, and deliver our services. We do not sell, rent, or share your personal or project details with third parties for marketing purposes.
            </p>

            <h2 style={{ fontSize: "22px", marginBottom: "16px", color: "var(--accent)" }}>3. Code and Infrastructure Ownership</h2>
            <p style={{ marginBottom: "24px" }}>
              Consistent with our team principles, all code, workflows, and infrastructure deployed during our engagements are delivered to your repositories, your cloud services, and your target database accounts. We do not maintain backdoor access or proprietary dependencies on the solutions shipped to you.
            </p>

            <h2 style={{ fontSize: "22px", marginBottom: "16px", color: "var(--accent)" }}>4. Security</h2>
            <p style={{ marginBottom: "24px" }}>
              We implement appropriate technical and organizational measures to secure your personal and business data. However, please be aware that no transmission over the Internet or electronic storage method can guarantee 100% security.
            </p>

            <h2 style={{ fontSize: "22px", marginBottom: "16px", color: "var(--accent)" }}>5. Contact Us</h2>
            <p>
              If you have any questions regarding this Privacy Policy, feel free to reach out to us at{" "}
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
