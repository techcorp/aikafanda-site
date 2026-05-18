import React from "react";
import Icon from "../layout/Icon";
import { createWhatsAppLink } from "@/lib/data";

interface WhatsAppButtonProps {
  message?: string;
  className?: string;
  children?: React.ReactNode;
}

export function WhatsAppButton({
  message = "Hi, I'd like to discuss AI automation solutions for my business.",
  className = "btn btn-wa",
  children,
}: WhatsAppButtonProps) {
  const link = createWhatsAppLink(message);

  return (
    <a
      href={link}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children || (
        <>
          <Icon name="wa" size={16} /> Message on WhatsApp
        </>
      )}
    </a>
  );
}

export function WhatsAppFab() {
  const link = createWhatsAppLink("Hi, I'd like to discuss AI automation solutions for my business.");

  return (
    <a
      className="fab-wa"
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp us"
    >
      <Icon name="wa" size={28} />
    </a>
  );
}
