import { cn } from "@/components/ui";

/** Small line icons used across stat cards, delivery settings and empty
 *  states. Same construction as CategoryIcon — 16px, stroke = currentColor. */
function base(className?: string) {
  return {
    viewBox: "0 0 16 16",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: cn("h-4 w-4 shrink-0", className),
    "aria-hidden": true,
  };
}

export function CoinIcon({ className }: { className?: string }) {
  return (
    <svg {...base(className)}>
      <circle cx="8" cy="8" r="5.5" />
      <path d="M8 5.3v5.4M6.4 6.4c0-.7.7-1.1 1.6-1.1s1.6.5 1.6 1.1-.7.9-1.6 1.1-1.6.5-1.6 1.1.7 1.1 1.6 1.1 1.6-.4 1.6-1.1" />
    </svg>
  );
}

export function BellIcon({ className }: { className?: string }) {
  return (
    <svg {...base(className)}>
      <path d="M8 2.5c-2 0-3 1.6-3 3.5 0 3-1 3.5-1 4h8c0-.5-1-1-1-4 0-1.9-1-3.5-3-3.5z" />
      <path d="M6.7 12a1.4 1.4 0 002.6 0" />
    </svg>
  );
}

export function ReceiptIcon({ className }: { className?: string }) {
  return (
    <svg {...base(className)}>
      <path d="M4 2.5h8v11l-1.5-1-1.5 1-1.5-1-1.5 1-1.5-1-1.5 1z" />
      <path d="M5.7 5.5h4.6M5.7 8h4.6" />
    </svg>
  );
}

export function PinIcon({ className }: { className?: string }) {
  return (
    <svg {...base(className)}>
      <path d="M8 14s4.5-4.2 4.5-7.5a4.5 4.5 0 10-9 0C3.5 9.8 8 14 8 14z" />
      <circle cx="8" cy="6.5" r="1.6" />
    </svg>
  );
}

export function ClockIcon({ className }: { className?: string }) {
  return (
    <svg {...base(className)}>
      <circle cx="8" cy="8" r="5.5" />
      <path d="M8 5v3.2l2.2 1.3" />
    </svg>
  );
}

export function TruckIcon({ className }: { className?: string }) {
  return (
    <svg {...base(className)}>
      <path d="M2 4.5h6.5v6H2z" />
      <path d="M8.5 7h2.7L13.5 9v1.5H8.5z" />
      <circle cx="4.7" cy="11.7" r="1.1" />
      <circle cx="11.2" cy="11.7" r="1.1" />
    </svg>
  );
}

export function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg {...base(className)}>
      <rect x="2.5" y="3.5" width="11" height="10" rx="1.2" />
      <path d="M2.5 6.5h11M5.3 2v3M10.7 2v3" />
    </svg>
  );
}

export function BagIcon({ className }: { className?: string }) {
  return (
    <svg {...base(className)}>
      <path d="M4 5.5h8l-.7 8H4.7z" />
      <path d="M5.7 5.5v-1a2.3 2.3 0 014.6 0v1" />
    </svg>
  );
}

export function StoreIcon({ className }: { className?: string }) {
  return (
    <svg {...base(className)}>
      <path d="M2.5 6.5 3.3 3h9.4l.8 3.5" />
      <path d="M2.8 6.5a1.6 1.6 0 003.1 0 1.6 1.6 0 003.1 0 1.6 1.6 0 003.1 0 1.6 1.6 0 003.1 0" />
      <path d="M3.5 6.8V13h9V6.8" />
      <path d="M6.5 13v-3a1.5 1.5 0 013 0v3" />
    </svg>
  );
}

export function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg {...base(className)}>
      <rect x="3" y="2.5" width="7" height="11" rx="0.8" />
      <path d="M10 6h2.5v7.5H10" />
      <path d="M5 5h1M8 5h1M5 7.5h1M8 7.5h1M5 10h1M8 10h1" />
    </svg>
  );
}

/** Hue-tinted circular badge for a Glyphs icon — the "dashboard" colour
 *  system used across KPI strips, delivery settings and billing sections.
 *  One hue per fact, kept consistent wherever that fact reappears. */
export function IconBadge({
  hue,
  size = 32,
  children,
}: {
  hue: number;
  size?: number;
  children: React.ReactNode;
}) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: `hsl(${hue} 55% 93%)`,
        color: `hsl(${hue} 45% 36%)`,
      }}
    >
      {children}
    </span>
  );
}
