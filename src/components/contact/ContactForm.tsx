"use client";

import React, { useState, useEffect } from "react";
import { validateContactForm, ValidationErrors } from "@/lib/validation";
import Icon from "../layout/Icon";

interface ContactFormProps {
  selectedSlot: string;
}

export default function ContactForm({ selectedSlot }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
    honeypot: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Inject selected calendar slot into the message box
  useEffect(() => {
    if (!selectedSlot) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData((prev) => {
      const slotText = `[Slot: ${selectedSlot}]`;
      if (!prev.message.includes("Slot:")) {
        return {
          ...prev,
          message: `${slotText}\n\n${prev.message}`,
        };
      } else {
        return {
          ...prev,
          message: prev.message.replace(/\[Slot: [^\]]+\]/, slotText),
        };
      }
    });
  }, [selectedSlot]);

  // Run validation on field blur
  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const { errors: valErrors } = validateContactForm(formData);
    setErrors((prev) => ({
      ...prev,
      [field]: valErrors[field as keyof ValidationErrors],
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // If already touched, validate on keystroke
    if (touched[name]) {
      const { errors: valErrors } = validateContactForm({
        ...formData,
        [name]: value,
      });
      setErrors((prev) => ({
        ...prev,
        [name]: valErrors[name as keyof ValidationErrors],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Trigger validation for all fields
    setTouched({
      name: true,
      email: true,
      service: true,
      message: true,
    });

    const { isValid, errors: valErrors } = validateContactForm(formData);
    setErrors(valErrors);

    if (!isValid) {
      // Focus the first error element
      const firstErrorKey = Object.keys(valErrors)[0];
      const el = document.getElementsByName(firstErrorKey)[0];
      if (el) el.focus();
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccess(false);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const resData = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          service: "",
          message: "",
          honeypot: "",
        });
        setTouched({});
        setErrors({});

        // Scroll success element into view
        setTimeout(() => {
          const successEl = document.getElementById("form-success");
          if (successEl) {
            successEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
        }, 100);
      } else {
        setErrorMessage(resData.error || "Failed to submit form. Please try again.");
      }
    } catch {
      setErrorMessage("An unexpected error occurred. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="glass contact-form glow-border" id="contact-form" onSubmit={handleSubmit} noValidate>
      {/* Honeypot Spam Prevention (Hidden) */}
      <div style={{ display: "none" }}>
        <label htmlFor="f-honeypot">Leave this blank</label>
        <input
          id="f-honeypot"
          name="honeypot"
          type="text"
          value={formData.honeypot}
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <div className={`field ${touched.name && errors.name ? "error" : ""}`} data-name="name">
          <label htmlFor="f-name">Your name</label>
          <input
            id="f-name"
            name="name"
            type="text"
            placeholder="Ali Khan"
            value={formData.name}
            onChange={handleChange}
            onBlur={() => handleBlur("name")}
            required
          />
          {touched.name && errors.name && <span className="field-error">{errors.name}</span>}
        </div>
        <div className={`field ${touched.email && errors.email ? "error" : ""}`} data-name="email">
          <label htmlFor="f-email">Email</label>
          <input
            id="f-email"
            name="email"
            type="email"
            placeholder="you@company.com"
            value={formData.email}
            onChange={handleChange}
            onBlur={() => handleBlur("email")}
            required
          />
          {touched.email && errors.email && <span className="field-error">{errors.email}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="field" data-name="phone">
          <label htmlFor="f-phone">Phone (optional)</label>
          <input
            id="f-phone"
            name="phone"
            type="tel"
            placeholder="+92 317 0000000"
            value={formData.phone}
            onChange={handleChange}
          />
          <span className="field-error" />
        </div>
        <div className={`field ${touched.service && errors.service ? "error" : ""}`} data-name="service">
          <label htmlFor="f-service">Service interest</label>
          <select
            id="f-service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            onBlur={() => handleBlur("service")}
            required
          >
            <option value="">Pick one…</option>
            <option value="Custom AI Agents Development">Custom AI Agents Development</option>
            <option value="Agentic AI Implementation">Agentic AI Implementation</option>
            <option value="Vibe Coding Website Creation">Vibe Coding Website Creation</option>
            <option value="Vibe Coding SaaS Development">Vibe Coding SaaS Development</option>
            <option value="n8n Automation Workflows">n8n Automation Workflows</option>
            <option value="AI Integration Services">AI Integration Services</option>
            <option value="Not sure — help me figure it out">Not sure — help me figure it out</option>
          </select>
          {touched.service && errors.service && <span className="field-error">{errors.service}</span>}
        </div>
      </div>

      <div className={`field ${touched.message && errors.message ? "error" : ""}`} data-name="message">
        <label htmlFor="f-message">What are you trying to build?</label>
        <textarea
          id="f-message"
          name="message"
          placeholder="A few sentences are enough. What's the current workflow? What would 'done' look like?"
          value={formData.message}
          onChange={handleChange}
          onBlur={() => handleBlur("message")}
          required
        />
        {touched.message && errors.message && <span className="field-error">{errors.message}</span>}
      </div>

      {errorMessage && (
        <div style={{ color: "#ef4444", fontSize: "14px", marginTop: "8px", fontWeight: 500 }}>
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        className="btn btn-primary"
        style={{ alignSelf: "flex-start", padding: "14px 28px" }}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Send message"}
        <Icon name="arrow" size={16} />
      </button>

      <div className={`form-success ${success ? "show" : ""}`} id="form-success">
        ✓ Got it. We&apos;ll reply within one business day.
      </div>
    </form>
  );
}
