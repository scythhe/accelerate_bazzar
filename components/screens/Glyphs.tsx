"use client";

import {
  Basket,
  Bread,
  CalendarBlank,
  ClipboardText,
  Clock,
  Coins,
  MagnifyingGlass,
  MapPin,
  MegaphoneSimple,
  Package,
  Storefront,
  Tray,
  Truck,
  type Icon,
} from "@phosphor-icons/react";
import { cn } from "@/components/ui";

/** The app's icon vocabulary. One family (Phosphor), one weight (duotone), and
 *  each idea always gets the same icon. Size with a className; they default to
 *  16px so they sit on a line of `small` text. */
function glyph(Phosphor: Icon) {
  return function Glyph({ className }: { className?: string }) {
    return (
      <Phosphor
        weight="duotone"
        aria-hidden="true"
        className={cn("h-4 w-4 shrink-0", className)}
      />
    );
  };
}

export const BagIcon = glyph(Package);
export const BasketIcon = glyph(Basket);
export const BreadIcon = glyph(Bread);
export const CalendarIcon = glyph(CalendarBlank);
export const ClockIcon = glyph(Clock);
export const CoinIcon = glyph(Coins);
export const InboxIcon = glyph(Tray);
export const NewsIcon = glyph(MegaphoneSimple);
export const PinIcon = glyph(MapPin);
export const ReceiptIcon = glyph(ClipboardText);
export const SearchIcon = glyph(MagnifyingGlass);
export const StoreIcon = glyph(Storefront);
export const TruckIcon = glyph(Truck);

const TONES = {
  herb: { background: "var(--herb-soft)", color: "var(--ok)" },
  saffron: { background: "var(--saffron-soft)", color: "var(--warn)" },
  pomegranate: { background: "var(--accent-soft)", color: "var(--accent)" },
};

/** Tinted circular badge for an icon. One tone per kind of fact, kept consistent
 *  wherever that fact reappears: money is herb, time is saffron, the rest are
 *  pomegranate. */
export function IconBadge({
  tone,
  size = 32,
  children,
}: {
  tone: keyof typeof TONES;
  size?: number;
  children: React.ReactNode;
}) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full"
      style={{ width: size, height: size, ...TONES[tone] }}
    >
      {children}
    </span>
  );
}
