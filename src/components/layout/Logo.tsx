import React from "react";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function Logo({ width = 150, height = 38, className, style }: LogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 160 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: "block", ...style }}
    >
      <defs>
        {/* Glow Filters */}
        <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Brand Gradients */}
        <linearGradient id="brand-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" /> {/* Neon Violet */}
          <stop offset="100%" stopColor="#22D3EE" /> {/* Neon Cyan */}
        </linearGradient>

        <linearGradient id="text-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
      </defs>

      {/* Futuristic AI Brandmark Icon */}
      <g filter="url(#logo-glow)">
        {/* Glowing Circuit Outer Hexagon */}
        <path
          d="M20 5 L32 12 L32 26 L20 33 L8 26 L8 12 Z"
          stroke="url(#brand-grad)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />
        
        {/* Connected AI Inner Core Nodes */}
        <circle cx="20" cy="19" r="3.5" fill="url(#brand-grad)" />
        <circle cx="14" cy="13" r="1.8" fill="#22D3EE" />
        <circle cx="26" cy="13" r="1.8" fill="#8B5CF6" />
        <circle cx="14" cy="25" r="1.8" fill="#8B5CF6" />
        <circle cx="26" cy="25" r="1.8" fill="#22D3EE" />

        {/* Core Node Connections */}
        <line x1="20" y1="19" x2="14" y2="13" stroke="rgba(34, 211, 238, 0.6)" strokeWidth="1" />
        <line x1="20" y1="19" x2="26" y2="13" stroke="rgba(139, 92, 246, 0.6)" strokeWidth="1" />
        <line x1="20" y1="19" x2="14" y2="25" stroke="rgba(139, 92, 246, 0.6)" strokeWidth="1" />
        <line x1="20" y1="19" x2="26" y2="25" stroke="rgba(34, 211, 238, 0.6)" strokeWidth="1" />
      </g>

      {/* Styled Brand Typography */}
      {/* "AI" - Neon Bold */}
      <text
        x="44"
        y="25"
        fill="#22D3EE"
        fontWeight="800"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="17"
        letterSpacing="0.05em"
        filter="url(#logo-glow)"
      >
        AI
      </text>

      {/* "ka" - Muted Elegance */}
      <text
        x="68"
        y="25"
        fill="rgba(255, 255, 255, 0.6)"
        fontWeight="400"
        fontFamily="var(--font-mono), monospace"
        fontSize="13"
        letterSpacing="0.02em"
      >
        ka
      </text>

      {/* "Fanda" - Pure Gradient White-to-Cyan/Purple */}
      <text
        x="89"
        y="25"
        fill="url(#text-grad)"
        fontWeight="800"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="17"
        letterSpacing="0.06em"
      >
        Fanda
      </text>

      {/* Neon dot at the end */}
      <circle cx="148" cy="22" r="2.5" fill="#8B5CF6" filter="url(#logo-glow)" />
    </svg>
  );
}
