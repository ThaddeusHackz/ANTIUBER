import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = (props: P) => ({
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...props,
});

export const Menu = (p: P) => (
  <svg {...base(p)}>
    <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />
  </svg>
);

export const Close = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const Globe = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5c2.2 2.3 3.4 5.3 3.4 8.5S14.2 18.2 12 20.5c-2.2-2.3-3.4-5.3-3.4-8.5S9.8 5.8 12 3.5z" />
  </svg>
);

export const ChevronDown = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 9.5l6 6 6-6" />
  </svg>
);

export const ChevronRight = (p: P) => (
  <svg {...base(p)}>
    <path d="M9.5 6l6 6-6 6" />
  </svg>
);

export const ChevronLeft = (p: P) => (
  <svg {...base(p)}>
    <path d="M14.5 6l-6 6 6 6" />
  </svg>
);

export const ArrowRight = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);

export const Pin = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 21s6.5-6 6.5-11a6.5 6.5 0 10-13 0C5.5 15 12 21 12 21z" />
    <circle cx="12" cy="10" r="2.4" />
  </svg>
);

export const CircleDot = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
  </svg>
);

export const Crosshair = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="7" />
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
    <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
  </svg>
);

export const Clock = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const Search = (p: P) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="7" />
    <path d="M16.5 16.5L21 21" />
  </svg>
);

export const Home = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-4.5v-6h-5v6H5a1 1 0 01-1-1v-9.5z" />
  </svg>
);

export const Briefcase = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="7.5" width="18" height="12" rx="2" />
    <path d="M9 7.5V6a2 2 0 012-2h2a2 2 0 012 2v1.5M3 12.5h18" />
  </svg>
);

export const Star = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3.6l2.5 5.2 5.7.8-4.1 4 1 5.7-5.1-2.7-5.1 2.7 1-5.7-4.1-4 5.7-.8L12 3.6z" />
  </svg>
);

export const StarFilled = (p: P) => (
  <svg {...base({ ...p, fill: "currentColor", stroke: "none" })}>
    <path d="M12 3.6l2.5 5.2 5.7.8-4.1 4 1 5.7-5.1-2.7-5.1 2.7 1-5.7-4.1-4 5.7-.8L12 3.6z" />
  </svg>
);

export const Car = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 16.5V13l1.8-4.2A2 2 0 017.6 7.5h8.8a2 2 0 011.8 1.3L20 13v3.5" />
    <path d="M4 13h16M4 16.5h16" />
    <circle cx="7.5" cy="17.5" r="1.6" />
    <circle cx="16.5" cy="17.5" r="1.6" />
  </svg>
);

export const Calendar = (p: P) => (
  <svg {...base(p)}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </svg>
);

export const Plane = (p: P) => (
  <svg {...base(p)}>
    <path d="M10.5 3.5l1.6 5.6 7.4 3.2a1.4 1.4 0 010 2.6l-2.2.9-4.3-2.1-2.6 3 2 2.1-1.6.7-2.4-2-2 1-.8-1.7 2.4-2.6-1.2-3.6z" />
  </svg>
);

export const Key = (p: P) => (
  <svg {...base(p)}>
    <circle cx="8" cy="8" r="4" />
    <path d="M11 11l9 9M16.5 16.5l2-2M18.5 18.5l2-2" />
  </svg>
);

export const Person = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M4.8 20.5c0-3.6 3.2-6.2 7.2-6.2s7.2 2.6 7.2 6.2" />
  </svg>
);

export const Phone = (p: P) => (
  <svg {...base(p)}>
    <path d="M7 3.5h3l1.2 3.6-2 1.4a11 11 0 005.3 5.3l1.4-2L19.5 13v3a2 2 0 01-2.2 2A15.5 15.5 0 015 5.7 2 2 0 017 3.5z" />
  </svg>
);

export const Mail = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="5.5" width="18" height="13" rx="2" />
    <path d="M3.6 7l8.4 6 8.4-6" />
  </svg>
);

export const Shield = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3.2l7 2.6v5.4c0 4.2-2.9 7.5-7 9.6-4.1-2.1-7-5.4-7-9.6V5.8l7-2.6z" />
    <path d="M9 12l2.2 2.2L15.4 10" />
  </svg>
);

export const Card = (p: P) => (
  <svg {...base(p)}>
    <rect x="2.5" y="5.5" width="19" height="13" rx="2.5" />
    <path d="M2.5 10h19M6 14.5h3" />
  </svg>
);

export const Cash = (p: P) => (
  <svg {...base(p)}>
    <rect x="2.5" y="6.5" width="19" height="11" rx="2" />
    <circle cx="12" cy="12" r="2.6" />
    <path d="M6 9.5v.01M18 14.5v.01" />
  </svg>
);

export const Wallet = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="6" width="18" height="13" rx="2.5" />
    <path d="M3 10h18M16.5 14.5h1.5" />
  </svg>
);

export const Receipt = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 3.5h12v17l-2.4-1.6-2.4 1.6-2.4-1.6L8.4 20.5 6 18.9V3.5z" />
    <path d="M9 8h6M9 12h6M9 15.5h3" />
  </svg>
);

export const User = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M4.8 20.5c0-3.6 3.2-6.2 7.2-6.2s7.2 2.6 7.2 6.2" />
  </svg>
);

export const Plus = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const Check = (p: P) => (
  <svg {...base(p)}>
    <path d="M4.5 12.5l5 5 10-11" />
  </svg>
);

export const Help = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M9.7 9.4a2.4 2.4 0 114.2 1.7c-.9.8-1.9 1.3-1.9 2.7" />
    <path d="M12 17.2v.01" />
  </svg>
);

export const Logout = (p: P) => (
  <svg {...base(p)}>
    <path d="M15 4.5h3.5A1.5 1.5 0 0120 6v12a1.5 1.5 0 01-1.5 1.5H15" />
    <path d="M10 12h9M15 8l4 4-4 4" />
  </svg>
);

export const Sparkle = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9L12 3.5z" />
  </svg>
);

export const Package = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3.5l8 4.2v8.6l-8 4.2-8-4.2V7.7l8-4.2z" />
    <path d="M4.3 7.9L12 12l7.7-4.1M12 12v8.5" />
  </svg>
);

export const Bolt = (p: P) => (
  <svg {...base(p)}>
    <path d="M13.5 2.5L5 13.5h5.5l-1 8L18.5 10H13l.5-7.5z" />
  </svg>
);

export const AppleLogo = (p: P) => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M16.4 12.7c0-2.2 1.8-3.3 1.9-3.4-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.7.8-3.4.8-.7 0-1.8-.8-3-.8-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.3 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7 2-1.1 2.8-2.2c.9-1.3 1.3-2.5 1.3-2.6-.1 0-2.7-1-2.7-4zM14.2 6.1c.6-.8 1-1.8.9-2.9-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.8-.9 2.8 1 .1 2-.5 2.7-1.3z" />
  </svg>
);

export const PlayLogo = (p: P) => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M3.6 2.3l11.6 6.6-2.8 2.8L3.6 2.3zm0 19.4l8.8-8.8 2.8 2.8L3.6 21.7zM2.9 3v18a.9.9 0 001.4.8l.2-.1L15.6 12 4.5 2.3A.9.9 0 002.9 3zm13.4 7.1l2.9 1.6c.8.5.8 1.2 0 1.7l-2.9 1.6-2.6-2.5 2.6-2.4z" />
  </svg>
);
