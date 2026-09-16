"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { gel } from "@/components/ui";
import { useDemo } from "@/lib/store/DemoContext";
import { groupCart } from "@/lib/cart";

const HIDDEN_ON = ["/cart", "/checkout", "/order-placed"];

// Sticky running total → the cart. Floating bottom-right so it sits opposite the
// persona switcher. Buyer only, and only once something is in the cart.
export function CartBar() {
  const pathname = usePathname();
  const { persona, cart, cartCount, cartTotal } = useDemo();

  if (persona !== "buyer") return null;
  if (cartCount === 0) return null;
  if (HIDDEN_ON.some((p) => pathname === p)) return null;

  const groups = groupCart(cart);
  const anyShort = groups.some((g) => !g.meetsMinimum);

  return (
    <Link
      href="/cart"
      className="fixed bottom-3 right-3 z-40 inline-flex h-11 items-center gap-3 rounded-full bg-ink pl-4 pr-3 text-white shadow-float"
    >
      <span className="text-small font-medium">
        კალათა · {cartCount}
      </span>
      <span className="tabular text-strong">{gel(cartTotal)}</span>
      <span
        aria-hidden
        className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/15"
      >
        {anyShort ? (
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden>
            <path
              d="M8 4v5M8 11.5v.5"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden>
            <path
              d="m4 8 3 3 5-6"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
    </Link>
  );
}
