import { cn } from "@/components/ui";

/** The Bazzar mark: a market awning over a stall. Stripes in saffron and cream,
 *  so it holds up on the pomegranate band and on the deep sidebar alike. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("h-7 w-7 shrink-0", className)}
      aria-hidden="true"
    >
      <path
        d="M7 18v10M25 18v10M7 24.5h18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path d="M4 5h6v12a3 3 0 0 1-6 0z" fill="var(--saffron)" />
      <path d="M10 5h6v12a3 3 0 0 1-6 0z" fill="#FFF6E5" />
      <path d="M16 5h6v12a3 3 0 0 1-6 0z" fill="var(--saffron)" />
      <path d="M22 5h6v12a3 3 0 0 1-6 0z" fill="#FFF6E5" />
    </svg>
  );
}

export function Logo({
  size = "md",
  className,
}: {
  size?: "md" | "lg";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-logo font-bold leading-none tracking-tight",
        size === "lg" ? "text-[40px]" : "text-[24px]",
        className,
      )}
    >
      <LogoMark className={size === "lg" ? "h-11 w-11" : "h-7 w-7"} />
      Bazzar
    </span>
  );
}
