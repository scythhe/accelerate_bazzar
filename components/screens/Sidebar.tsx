"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/components/ui";
import { CategoryIcon, SearchIcon } from "./CategoryIcon";
import { BagIcon, BellIcon, CoinIcon, ReceiptIcon, TruckIcon } from "./Glyphs";
import { useDemo } from "@/lib/store/DemoContext";
import {
  BUYER,
  HOME_CATEGORIES,
  SUPPLIER_PERSONA_ID,
  supplierById,
} from "@/lib/mock/data";

// Matches BuyerHome's category tile hues so the sidebar reads as the same
// system, not a second palette.
const CATEGORY_HUE: Record<string, number> = {
  eggs: 44,
  veg: 132,
  fruit: 20,
  dairy: 208,
  meat: 4,
  bakery: 32,
  oil: 66,
  pickle: 92,
};

const SUPPLIER_TABS = [
  { href: "/", label: "შემოსული", icon: BellIcon },
  { href: "/supplier/catalogue", label: "კატალოგი", icon: BagIcon },
  { href: "/supplier/delivery", label: "მიწოდება", icon: TruckIcon },
  { href: "/supplier/billing", label: "გეგმა", icon: CoinIcon },
];

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 rounded px-2.5 py-2 text-small transition-colors",
        active
          ? "bg-accent-soft font-medium text-accent"
          : "text-ink-2 hover:bg-surface-hover hover:text-ink",
      )}
    >
      {children}
    </Link>
  );
}

// Persistent left nav, lg and up only — fills the horizontal space a laptop
// browser has that a phone never does, with real navigation instead of a
// wider empty gutter. Below lg this renders nothing; the mobile app is
// unchanged.
export function Sidebar() {
  const { persona } = useDemo();
  const pathname = usePathname();
  const router = useRouter();

  if (persona === "supplier") {
    const supplier = supplierById(SUPPLIER_PERSONA_ID);
    return (
      <aside className="hidden shrink-0 border-r border-line bg-surface px-4 py-6 lg:block lg:w-60">
        <p className="text-h3 tracking-tight text-ink">Accelerate</p>
        <p className="mt-0.5 truncate text-small text-ink-2">
          {supplier.displayName}
        </p>
        <nav className="mt-6 flex flex-col gap-1">
          {SUPPLIER_TABS.map((t) => {
            const Icon = t.icon;
            return (
              <NavLink key={t.href} href={t.href} active={pathname === t.href}>
                <Icon className="h-4 w-4" />
                {t.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    );
  }

  return (
    <aside className="hidden shrink-0 border-r border-line bg-surface px-4 py-6 lg:block lg:w-60">
      <p className="text-h3 tracking-tight text-ink">Accelerate</p>
      <p className="mt-0.5 truncate text-small text-ink-2">
        {BUYER.displayName}
      </p>

      <nav className="mt-6 flex flex-col gap-1">
        <NavLink href="/" active={pathname === "/"}>
          <SearchIcon className="h-4 w-4" />
          ძებნა
        </NavLink>
        <NavLink href="/orders" active={pathname.startsWith("/orders")}>
          <ReceiptIcon className="h-4 w-4" />
          შეკვეთები
        </NavLink>
      </nav>

      <p className="mb-2 mt-6 px-2.5 text-micro text-ink-3">კატეგორიები</p>
      <nav className="flex flex-col gap-1">
        {HOME_CATEGORIES.map((c) => {
          const hue = CATEGORY_HUE[c.slug] ?? 0;
          return (
            <button
              key={c.slug}
              type="button"
              onClick={() => router.push(`/search?q=${encodeURIComponent(c.query)}`)}
              className="flex items-center gap-2.5 rounded px-2.5 py-2 text-left text-small text-ink-2 transition-colors hover:bg-surface-hover hover:text-ink"
            >
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                style={{
                  backgroundColor: `hsl(${hue} 55% 93%)`,
                  color: `hsl(${hue} 45% 36%)`,
                }}
              >
                <CategoryIcon slug={c.slug} className="h-3.5 w-3.5" />
              </span>
              {c.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
