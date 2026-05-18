// Form validation and sanitization utilities

export interface ContactInput {
  name: string;
  email: string;
  phone?: string;
  service: string;
  message: string;
  slot?: string;
  honeypot?: string;
}

export interface ValidationErrors {
  name?: string;
  email?: string;
  service?: string;
  message?: string;
}

export function sanitizeString(val: string): string {
  return val
    .trim()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

export function validateContactForm(data: Partial<ContactInput>): { isValid: boolean; errors: ValidationErrors } {
  const errors: ValidationErrors = {};

  const name = (data.name || "").trim();
  if (name.length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  const email = (data.email || "").trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.email = "Please provide a valid email address.";
  }

  const service = (data.service || "").trim();
  if (!service) {
    errors.service = "Please select a service interest.";
  }

  const message = (data.message || "").trim();
  if (message.length < 10) {
    errors.message = "Message must be at least 10 characters.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
