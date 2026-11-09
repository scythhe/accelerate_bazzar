"use client";

import Link from "next/link";
import { CaretLeft } from "@phosphor-icons/react";
import { cn } from "@/components/ui";

/** Product lists: a column of cards on a phone, then as many columns as the
 *  screen has room for. */
export const PRODUCT_GRID =
  "grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-3 min-[1700px]:grid-cols-3 min-[2200px]:grid-cols-4";

/** Shared page frame — fills the screen, with room at the bottom for the tab bar
 *  and cart bar. `narrow` is for forms and single documents, where a stretched
 *  line is harder to read. */
export function Screen({
  children,
  className,
  narrow = false,
}: {
  children: React.ReactNode;
  className?: string;
  narrow?: boolean;
}) {
  return (
    <main
      className={cn(
        "enter mx-auto w-full px-4 pb-40 pt-4 sm:px-6 lg:px-8 lg:pb-28 xl:px-10",
        narrow && "max-w-[720px]",
        className,
      )}
    >
      {children}
    </main>
  );
}

/** The band at the top of a screen. Continues the app bar on phones and is a
 *  rounded panel beside the sidebar on desktop. Give it `image` and it becomes a
 *  photographic hero; `sticky` pins it so search stays in reach down a long list. */
export function Band({
  children,
  sticky = false,
  image,
  className,
}: {
  children: React.ReactNode;
  sticky?: boolean;
  image?: string;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative -mx-4 -mt-4 bg-brand px-4 text-white sm:-mx-6 sm:px-6 lg:mx-0 lg:mt-0 lg:rounded-lg lg:px-8",
        sticky && "sticky top-0 z-20 pb-3 pt-1 lg:py-3",
        !sticky && (image ? "pb-7 pt-6 lg:py-10" : "pb-6 pt-2 lg:pt-6"),
        className,
      )}
    >
      {image && (
        // Its own clipped layer, so the search suggestions can overflow the band.
        <span
          aria-hidden="true"
          className="absolute inset-0 overflow-hidden lg:rounded-lg"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" className="h-full w-full object-cover" />
          <span className="absolute inset-0 bg-gradient-to-r from-brand-deep/95 via-brand/80 to-brand/30" />
        </span>
      )}
      <div className="relative">{children}</div>
    </section>
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
      <CaretLeft weight="bold" aria-hidden="true" className="h-3.5 w-3.5" />
      {children}
    </Link>
  );
}
