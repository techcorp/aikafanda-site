import React from "react";

export type IconName =
  | "arrow"
  | "play"
  | "bot"
  | "network"
  | "code"
  | "layers"
  | "spark"
  | "shield"
  | "clock"
  | "rocket"
  | "check"
  | "quote"
  | "star"
  | "wa"
  | "chat"
  | "eye"
  | "grid"
  | "linkedin"
  | "facebook"
  | "monitor"
  | "cube"
  | "github"
  | "twitter"
  | "youtube";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export default function Icon({ name, size = 20, ...props }: IconProps) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <path d="M5 12h14M13 5l7 7-7 7" />,
    play: <path d="M8 5v14l11-7z" fill="currentColor" />,
    bot: (
      <>
        <rect x="3" y="8" width="18" height="12" rx="3" />
        <path d="M12 4v4M8 14h.01M16 14h.01M9 18h6" />
      </>
    ),
    network: (
      <>
        <circle cx="6" cy="6" r="2.5" />
        <circle cx="18" cy="6" r="2.5" />
        <circle cx="12" cy="18" r="2.5" />
        <path d="M7.5 7.5l3 8M16.5 7.5l-3 8M8 6h8" />
      </>
    ),
    code: <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />,
    layers: (
      <>
        <path d="M12 2l10 5-10 5L2 7l10-5z" />
        <path d="M2 12l10 5 10-5M2 17l10 5 10-5" />
      </>
    ),
    spark: <path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l3 3M16 16l3 3M5 19l3-3M16 8l3-3" />,
    shield: <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </>
    ),
    rocket: (
      <>
        <path d="M5 13l3-3 3 3-3 3-3-3z" transform="rotate(45 8 13)" />
        <path d="M14 4l6 6-9 9-6-6 9-9zM14 4l-3-1 1 4M20 10l-1-3 4 1" />
      </>
    ),
    check: <path d="M5 13l4 4L19 7" />,
    quote: <path d="M7 7h4v4H7v4h4v4H3V11l4-4zm10 0h4v4h-4v4h4v4h-8V11l4-4z" fill="currentColor" />,
    star: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" />,
    wa: <path d="M20.5 3.5A11 11 0 0 0 3 19.5L1.5 23l3.6-1.5A11 11 0 1 0 20.5 3.5zm-2 14.4c-.4 1.1-2 2-2.8 2.1-.8.1-1.8.2-2.9-.2-.7-.2-1.5-.5-2.6-1-4.6-2-7.6-6.7-7.8-7-.2-.3-1.9-2.5-1.9-4.7s1.2-3.4 1.6-3.8c.4-.4.9-.5 1.2-.5h.8c.3 0 .7 0 1 .8.4.9 1.2 3.1 1.3 3.3.1.2.2.5 0 .8l-.5.7c-.2.3-.5.5-.7.8-.2.3-.5.5-.2 1 .3.5 1.3 2.1 2.7 3.4 1.9 1.7 3.4 2.2 3.9 2.4.5.2.8.2 1.1-.1.3-.3 1.2-1.4 1.6-1.9.3-.5.7-.4 1.1-.2.5.2 2.8 1.3 3.3 1.5.5.2.8.4 1 .5.1.4.1 1.4-.3 2.4z" fill="currentColor" />,
    chat: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
    eye: (
      <>
        <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </>
    ),
    linkedin: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="3" fill="currentColor" />
        <path d="M7 10v7M7 7v.01M11 17v-4a2 2 0 0 1 4 0v4M11 13v4" stroke="#0B0E1C" strokeWidth="1.8" />
      </>
    ),
    facebook: <path d="M22 12a10 10 0 1 0-11.6 9.9V15h-2.5v-3h2.5V9.5a3.5 3.5 0 0 1 3.7-3.9c1.1 0 2.2.2 2.2.2v2.4h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.5 3h-2.3v6.9A10 10 0 0 0 22 12z" fill="currentColor" />,
    monitor: (
      <>
        <rect x="2" y="4" width="20" height="13" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </>
    ),
    cube: (
      <>
        <path d="M12 2l9 5v10l-9 5-9-5V7l9-5zM3 7l9 5 9-5M12 12v10" />
      </>
    ),
    github: <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />,
    twitter: <path d="M18 2h3l-7 8 8 12h-6l-5-7-6 7H2l8-9L2 2h6l4 6 6-6z" fill="currentColor" />,
    youtube: <path d="M23 6a3 3 0 0 0-2-2.8C19 2.5 12 2.5 12 2.5s-7 0-9 .7A3 3 0 0 0 1 6v6a3 3 0 0 0 2 2.8c2 .7 9 .7 9 .7s7 0 9-.7A3 3 0 0 0 23 12V6zM10 13V5l6 4-6 4z" fill="currentColor" />,
  };

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
