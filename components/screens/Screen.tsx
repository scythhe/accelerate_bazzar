"use client";

import Link from "next/link";
import { cn } from "@/components/ui";

/** Shared page frame — 380px-first column, room at the bottom for the floating
 *  persona switcher and cart bar. */
export function Screen({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main
      className={cn(
        "mx-auto w-full max-w-[520px] px-4 pb-28 pt-4 sm:px-6",
        className,
      )}
    >
      {children}
    </main>
  );
}

export function BackLink({
  href,
  children = "უკან",
}: {
  href: string;
  children?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="mb-3 inline-flex items-center gap-1 text-small text-ink-2 transition-colors hover:text-ink"
    >
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
        <path
          d="M10 3 5 8l5 5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {children}
    </Link>
  );
}
