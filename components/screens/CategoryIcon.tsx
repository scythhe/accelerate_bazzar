import { cn } from "@/components/ui";

/** Small line glyphs for the category strip. 16px, stroke = currentColor. */
export function CategoryIcon({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const common = {
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: cn("h-4 w-4 shrink-0", className),
    "aria-hidden": true,
  };

  switch (slug) {
    case "eggs":
      return (
        <svg {...common}>
          <ellipse cx="8" cy="9" rx="4.2" ry="5.3" />
        </svg>
      );
    case "veg":
      return (
        <svg {...common}>
          <path d="M4 12c0-4.4 3.6-8 8-8 0 4.4-3.6 8-8 8z" />
          <path d="M4 12l3-3" />
        </svg>
      );
    case "fruit":
      return (
        <svg {...common}>
          <path d="M8 5c-3 0-4.5 2.2-4.5 5S5 15 8 15s4.5-2.2 4.5-5S11 5 8 5z" />
          <path d="M8 5V2.5" />
          <path d="M8 3.5c1.2-1 2.4-1 3-1-.2 1.4-1 2-2 2" />
        </svg>
      );
    case "dairy":
      return (
        <svg {...common}>
          <path d="M6 5h4l1.2 8.2a1 1 0 01-1 1.3H5.8a1 1 0 01-1-1.3z" />
          <path d="M5.6 5l.8-2h3.2l.8 2" />
        </svg>
      );
    case "meat":
      return (
        <svg {...common}>
          <path d="M9.5 4.2a3.8 3.8 0 00-5 5.5l-2 2 1.8 1.8 2-2a3.8 3.8 0 005.5-5" />
          <circle cx="11" cy="5" r="1.6" />
        </svg>
      );
    case "pickle":
      return (
        <svg {...common}>
          <rect x="5" y="5.5" width="6" height="8.5" rx="1.4" />
          <path d="M4.5 3.5h7v2h-7z" />
        </svg>
      );
    case "oil":
      return (
        <svg {...common}>
          <path d="M8 2.5c3 3.6 4.3 5.8 4.3 8a4.3 4.3 0 01-8.6 0c0-2.2 1.3-4.4 4.3-8z" />
        </svg>
      );
    case "bakery":
      return (
        <svg {...common}>
          <path d="M3 10.5a5 4 0 0110 0v2.5a1 1 0 01-1 1H4a1 1 0 01-1-1z" />
          <path d="M6 10.5v3M9 10.5v3" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="5" />
        </svg>
      );
  }
}

export function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-4 w-4", className)}
      aria-hidden="true"
    >
      <circle cx="7" cy="7" r="4.4" />
      <path d="M10.5 10.5L14 14" />
    </svg>
  );
}
