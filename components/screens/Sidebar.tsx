"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/components/ui";
import { Logo } from "@/components/Logo";
import { PersonaSwitcher } from "@/components/PersonaSwitcher";
import {
  BagIcon,
  CoinIcon,
  InboxIcon,
  NewsIcon,
  ReceiptIcon,
  StoreIcon,
  TruckIcon,
} from "./Glyphs";
import { useDemo } from "@/lib/store/DemoContext";
import {
  BUYER,
  HOME_CATEGORIES,
  SUPPLIER_PERSONA_ID,
  supplierById,
} from "@/lib/mock/data";

const SUPPLIER_TABS = [
  { href: "/", label: "შემოსული", icon: InboxIcon },
  { href: "/supplier/catalogue", label: "კატალოგი", icon: BagIcon },
  { href: "/supplier/delivery", label: "მიწოდება", icon: TruckIcon },
  { href: "/supplier/billing", label: "გეგმა", icon: CoinIcon },
];

const LINK =
  "flex items-center gap-2.5 rounded px-3 py-2 text-strong transition-colors";

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
      aria-current={active ? "page" : undefined}
      className={cn(
        LINK,
        active
          ? "bg-white/15 text-white"
          : "text-white/80 hover:bg-white/10 hover:text-white",
      )}
    >
      {children}
    </Link>
  );
}

// Persistent left nav, lg and up. The deep band colour gives the wide layout a
// solid edge to hang off; below lg the TabBar and AppBar take over.
export function Sidebar() {
  const { persona, unreadNews } = useDemo();
  const pathname = usePathname();
  const supplier = supplierById(SUPPLIER_PERSONA_ID);
  const isBuyer = persona === "buyer";

  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col overflow-y-auto bg-brand-deep px-3 py-5 text-white lg:flex">
      <Link href="/" className="px-3" aria-label="Bazzar — მთავარი">
        <Logo />
      </Link>
      <p className="mt-2 truncate px-3 text-small text-white/70">
        {isBuyer ? BUYER.displayName : supplier.displayName}
      </p>

      {isBuyer ? (
        <>
          <nav className="mt-5 flex flex-col gap-0.5">
            <NavLink
              href="/"
              active={pathname === "/" || pathname === "/search"}
            >
              <StoreIcon className="h-5 w-5" />
              მთავარი
            </NavLink>
            <NavLink href="/news" active={pathname === "/news"}>
              <NewsIcon className="h-5 w-5" />
              სიახლეები
              {unreadNews > 0 && (
                <span className="tabular ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-saffron px-1.5 text-micro leading-none text-ink">
                  {unreadNews}
                </span>
              )}
            </NavLink>
            <NavLink href="/orders" active={pathname.startsWith("/orders")}>
              <ReceiptIcon className="h-5 w-5" />
              შეკვეთები
            </NavLink>
          </nav>

          <p className="mb-1.5 mt-6 px-3 text-micro text-white/60">კატეგორიები</p>
          <nav className="flex flex-col gap-0.5">
            {HOME_CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/search?q=${encodeURIComponent(c.query)}`}
                className="flex items-center gap-2.5 rounded px-3 py-1.5 text-small text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.image}
                  alt=""
                  width={24}
                  height={24}
                  loading="lazy"
                  className="h-6 w-6 shrink-0 rounded-full object-cover"
                />
                {c.label}
              </Link>
            ))}
          </nav>
        </>
      ) : (
        <nav className="mt-5 flex flex-col gap-0.5">
          {SUPPLIER_TABS.map((t) => {
            const Icon = t.icon;
            return (
              <NavLink
                key={t.href}
                href={t.href}
                active={
                  t.href === "/" ? pathname === "/" : pathname.startsWith(t.href)
                }
              >
                <Icon className="h-5 w-5" />
                {t.label}
              </NavLink>
            );
          })}
        </nav>
      )}

      <div className="mt-auto pt-6 [&>button]:w-full">
        <PersonaSwitcher onBrand />
      </div>
    </aside>
  );
}
