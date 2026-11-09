"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardText,
  Coins,
  MegaphoneSimple,
  Package,
  Storefront,
  Tray,
  Truck,
  type Icon,
} from "@phosphor-icons/react";
import { cn } from "@/components/ui";
import { useDemo } from "@/lib/store/DemoContext";

interface Tab {
  href: string;
  label: string;
  icon: Icon;
  match?: string[];
  badge?: number;
}

// The phone's main navigation, under the thumb. The cart has its own bar above
// this, and the cart page swaps both for its send button.
export function TabBar() {
  const pathname = usePathname();
  const { persona, unreadNews } = useDemo();

  if (pathname === "/cart") return null;

  const tabs: Tab[] =
    persona === "buyer"
      ? [
          { href: "/", label: "მთავარი", icon: Storefront, match: ["/search"] },
          {
            href: "/news",
            label: "სიახლეები",
            icon: MegaphoneSimple,
            badge: unreadNews,
          },
          { href: "/orders", label: "შეკვეთები", icon: ClipboardText },
        ]
      : [
          { href: "/", label: "შემოსული", icon: Tray },
          { href: "/supplier/catalogue", label: "კატალოგი", icon: Package },
          { href: "/supplier/delivery", label: "მიწოდება", icon: Truck },
          { href: "/supplier/billing", label: "გეგმა", icon: Coins },
        ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      <div className="flex">
        {tabs.map(({ href, label, icon: Icon, match, badge }) => {
          const active =
            href === "/"
              ? pathname === "/" || Boolean(match?.includes(pathname))
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex h-16 flex-1 flex-col items-center justify-center gap-0.5 text-micro transition-colors",
                active ? "font-semibold text-accent" : "text-ink-2 hover:text-ink",
              )}
            >
              <span className="relative">
                <Icon
                  weight={active ? "fill" : "duotone"}
                  aria-hidden="true"
                  className="h-6 w-6"
                />
                {badge ? (
                  <span className="tabular absolute -right-3 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[11px] font-semibold leading-none text-white">
                    {badge}
                  </span>
                ) : null}
              </span>
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
