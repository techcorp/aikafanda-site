"use client";

import React, { useState, useEffect, useRef } from "react";

const PALETTES = [
  { id: "violet-cyan", label: "Violet & Cyan", colors: ["#8B5CF6", "#22D3EE", "#E879F9"] },
  { id: "magenta-cyan", label: "Magenta & Cyan", colors: ["#EC4899", "#22D3EE", "#8B5CF6"] },
  { id: "emerald-cyan", label: "Emerald & Cyan", colors: ["#10B981", "#22D3EE", "#A7F3D0"] },
  { id: "amber-violet", label: "Amber & Violet", colors: ["#F59E0B", "#EC4899", "#8B5CF6"] },
];

export default function ThemeTweaks() {
  const [isOpen, setIsOpen] = useState(false);
  const [palette, setPalette] = useState("violet-cyan");
  const [density, setDensity] = useState("default");
  const [motion, setMotion] = useState("on");
  const panelRef = useRef<HTMLDivElement>(null);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedPalette = localStorage.getItem("tweak-palette") || "violet-cyan";
    const savedDensity = localStorage.getItem("tweak-density") || "default";
    const savedMotion = localStorage.getItem("tweak-motion") || "on";

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPalette(savedPalette);
    setDensity(savedDensity);
    setMotion(savedMotion);

    document.documentElement.setAttribute("data-palette", savedPalette);
    document.documentElement.setAttribute("data-density", savedDensity);
    document.documentElement.setAttribute("data-anim", savedMotion);
  }, []);

  // Update theme attributes on change
  const handlePaletteChange = (id: string) => {
    setPalette(id);
    localStorage.setItem("tweak-palette", id);
    document.documentElement.setAttribute("data-palette", id);
  };

  const handleDensityChange = (val: string) => {
    setDensity(val);
    localStorage.setItem("tweak-density", val);
    document.documentElement.setAttribute("data-density", val);
  };

  const handleMotionChange = (val: string) => {
    setMotion(val);
    localStorage.setItem("tweak-motion", val);
    document.documentElement.setAttribute("data-anim", val);
  };

  // Close panel on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  return (
    <div style={{ position: "fixed", bottom: "96px", right: "24px", zIndex: 100 }}>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          background: "var(--surface-2)",
          border: "1px solid var(--border-strong)",
          backdropFilter: "blur(12px)",
          color: "var(--fg)",
          display: "grid",
          placeItems: "center",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          cursor: "pointer",
          transition: "transform 0.3s ease",
        }}
        className="hover:scale-105"
        aria-label="Customize theme"
      >
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ animation: motion === "on" ? "spin 8s linear infinite" : "none" }}
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>

      {/* Tweaks Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          style={{
            position: "absolute",
            bottom: "64px",
            right: "0",
            width: "280px",
            background: "rgba(11, 14, 28, 0.9)",
            border: "1px solid var(--border-strong)",
            borderRadius: "14px",
            padding: "20px",
            color: "var(--fg)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
            backdropFilter: "blur(20px)",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            animation: "fadeIn 0.25s ease-out",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h4 style={{ fontSize: "14px", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Theme Tweaks
            </h4>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: "none", border: "none", color: "var(--fg-muted)", cursor: "pointer" }}
            >
              ✕
            </button>
          </div>

          <hr style={{ border: "0", borderTop: "1px solid var(--border)", margin: "0" }} />

          {/* Color Palettes */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--fg-muted)", textTransform: "uppercase" }}>
              Palette
            </span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
              {PALETTES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePaletteChange(p.id)}
                  style={{
                    padding: "8px",
                    borderRadius: "8px",
                    background: palette === p.id ? "rgba(255,255,255,0.08)" : "var(--surface)",
                    border: palette === p.id ? "1px solid var(--primary)" : "1px solid var(--border)",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <div style={{ display: "flex", gap: "3px" }}>
                    {p.colors.map((c, idx) => (
                      <span
                        key={idx}
                        style={{ width: "10px", height: "10px", borderRadius: "50%", background: c }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: "10px", color: "var(--fg)" }}>{p.label.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Density Selection */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--fg-muted)", textTransform: "uppercase" }}>
              Layout Density
            </span>
            <div style={{ display: "flex", background: "var(--surface)", borderRadius: "8px", padding: "2px", border: "1px solid var(--border)" }}>
              {["compact", "default", "roomy"].map((val) => (
                <button
                  key={val}
                  onClick={() => handleDensityChange(val)}
                  style={{
                    flex: 1,
                    padding: "6px",
                    borderRadius: "6px",
                    background: density === val ? "var(--primary)" : "transparent",
                    color: density === val ? "#fff" : "var(--fg-muted)",
                    border: "none",
                    fontSize: "11px",
                    textTransform: "capitalize",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* Motion Toggle */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--fg-muted)", textTransform: "uppercase" }}>
              Animations
            </span>
            <div style={{ display: "flex", background: "var(--surface)", borderRadius: "8px", padding: "2px", border: "1px solid var(--border)" }}>
              {["on", "off"].map((val) => (
                <button
                  key={val}
                  onClick={() => handleMotionChange(val)}
                  style={{
                    flex: 1,
                    padding: "6px",
                    borderRadius: "6px",
                    background: motion === val ? "var(--primary)" : "transparent",
                    color: motion === val ? "#fff" : "var(--fg-muted)",
                    border: "none",
                    fontSize: "11px",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Spin Animation Styles */}
      <style jsx global>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
