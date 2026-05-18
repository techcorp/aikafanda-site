import React from "react";
import Link from "next/link";
import ContactPageClient from "@/components/contact/ContactPageClient";

export const metadata = {
  title: "Contact · AI ka Fanda",
  description: "Talk to us about your project. WhatsApp, email or book a consultation slot. Karachi, Pakistan.",
};

export default function ContactPage() {
  return (
    <main>
      {/* HERO */}
      <section className="page-hero">
        <div className="container page-hero-inner">
          <span className="breadcrumb">
            <Link href="/">Home</Link> / Contact
          </span>
          <span className="eyebrow">Get in touch</span>
          <h1>
            Tell us what you&apos;re
            <br />
            <span className="gradient-text">trying to ship.</span>
          </h1>
          <p>
            We reply within one business day. If it&apos;s urgent, ping us on WhatsApp — we&apos;re usually on it the same hour.
          </p>
        </div>
      </section>

      {/* CONTACT GRID */}
      <ContactPageClient />
    </main>
  );
}
