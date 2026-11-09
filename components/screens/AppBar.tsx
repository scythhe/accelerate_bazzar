"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { PersonaSwitcher } from "@/components/PersonaSwitcher";

// The phone's top bar. Navigation lives in the TabBar at the bottom, so this only
// carries the brand. It shares the band colour of whatever sits below it.
export function AppBar() {
  return (
    <header className="flex h-14 items-center justify-between gap-2 bg-brand pl-4 pr-2 text-white sm:pl-6 lg:hidden">
      <Link href="/" aria-label="Bazzar — მთავარი">
        <Logo />
      </Link>
      <PersonaSwitcher onBrand />
    </header>
  );
}
