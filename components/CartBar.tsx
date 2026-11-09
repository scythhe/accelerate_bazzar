"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CaretRight } from "@phosphor-icons/react";
import { gel } from "@/components/ui";
import { BasketIcon } from "@/components/screens/Glyphs";
import { useDemo } from "@/lib/store/DemoContext";
import { groupCart } from "@/lib/cart";

const HIDDEN_ON = ["/cart", "/order-placed"];

// Sticky running total → the cart. Full width at the thumb on a phone: once
// something's in the cart, this is the next step, so it's the biggest target on
// the screen. Buyer only, and only once something is in the cart.
export function CartBar() {
  const pathname = usePathname();
  const { persona, cart, cartCount, cartTotal, customProducts } = useDemo();

  if (persona !== "buyer") return null;
  if (cartCount === 0) return null;
  if (HIDDEN_ON.some((p) => pathname === p)) return null;

  const anyShort = groupCart(cart, customProducts).some((g) => !g.meetsMinimum);

  return (
    <Link
      href="/cart"
      className="enter fixed inset-x-3 bottom-[76px] z-40 mb-[env(safe-area-inset-bottom)] flex h-14 items-center gap-3 rounded-lg bg-brand-deep px-4 text-white shadow-float transition-transform hover:-translate-y-0.5 md:left-auto md:right-6 md:w-96 lg:bottom-4"
    >
      <span className="relative shrink-0">
        <BasketIcon className="h-7 w-7 text-saffron" />
        <span className="tabular absolute -right-2 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-saffron px-1 text-[11px] font-semibold leading-none text-ink">
          {cartCount}
        </span>
      </span>
      <span className="tabular ml-1 text-strong">{gel(cartTotal)}</span>
      <span className="ml-auto flex items-center gap-1.5 text-strong">
        {anyShort && (
          <span aria-hidden className="h-2 w-2 rounded-full bg-saffron" />
        )}
        კალათა
        <CaretRight weight="bold" aria-hidden="true" className="h-4 w-4" />
      </span>
    </Link>
  );
}
