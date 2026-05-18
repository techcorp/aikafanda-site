"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Icon from "./Icon";
import { createWhatsAppLink } from "@/lib/data";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { id: "home", label: "Home", href: "/" },
    { id: "services", label: "Services", href: "/services" },
    { id: "about", label: "About", href: "/about" },
    { id: "contact", label: "Contact", href: "/contact" },
  ];

  // Close nav on click outside
  useEffect(() => {
    if (!open) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".nav")) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [open]);

  // Close nav when path changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  const waLink = createWhatsAppLink("Hi, I'd like to discuss AI automation solutions for my business.");

  return (
    <nav className={`nav ${open ? "open" : ""}`}>
      <div className="container nav-inner">
        <Link href="/" className="brand" aria-label="Home page">
          <Image
            src="/aikafanda.png"
            alt="AI ka Fanda"
            width={120}
            height={36}
            className="brand-logo"
            style={{ width: "auto", height: "auto" }}
            priority
          />
        </Link>
        <ul className="nav-links">
          {links.map((l) => {
            const isActive =
              l.href === "/"
                ? pathname === "/"
                : pathname.startsWith(l.href);
            return (
              <li key={l.id}>
                <Link
                  href={l.href}
                  className={isActive ? "active" : ""}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <a
          className="btn btn-primary nav-cta"
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon name="wa" size={16} /> Talk on WhatsApp
        </a>
        <button
          className="nav-toggle"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          <Icon name="grid" />
        </button>
      </div>
    </nav>
  );
}
