"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/components/ui";

const TABS = [
  { href: "/", label: "შემოსული" },
  { href: "/supplier/catalogue", label: "კატალოგი" },
  { href: "/supplier/delivery", label: "მიწოდება" },
  { href: "/supplier/billing", label: "გეგმა" },
];

/** --accent marks the active tab — one of its four sanctioned uses
 *  (DESIGN_SYSTEM.md §3). */
export function SupplierNav() {
  const pathname = usePathname();
  return (
    <nav className="-mx-4 mt-4 flex gap-5 overflow-x-auto border-b border-line px-4 [&::-webkit-scrollbar]:hidden lg:hidden">
      {TABS.map((t) => {
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            className={cn(
              "shrink-0 border-b-2 py-2.5 text-small transition-colors",
              active
                ? "border-accent font-medium text-accent"
                : "border-transparent text-ink-2 hover:text-ink",
            )}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
