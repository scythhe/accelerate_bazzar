import { cn } from "./cn";

const TONES = [
  { background: "var(--accent-soft)", color: "var(--accent)" },
  { background: "var(--saffron-soft)", color: "var(--warn)" },
  { background: "var(--herb-soft)", color: "var(--ok)" },
];

function toneFor(seed: string) {
  let x = 0;
  for (let i = 0; i < seed.length; i++) x = (x * 31 + seed.charCodeAt(i)) >>> 0;
  return TONES[x % TONES.length];
}

export interface AvatarProps {
  /** Full name — supplies the monogram letter. */
  name: string;
  /** Stable id the colour is derived from (an org id, not the display name,
   *  which can repeat). */
  seed: string;
  size?: number; // px
  className?: string;
}

/** A supplier's visual identity where a plain name string would otherwise
 *  repeat across the inbox, cart, checkout and storefront header. */
export function Avatar({ name, seed, size = 32, className }: AvatarProps) {
  const letter = name.match(/[Ⴀ-ჿ]/)?.[0] ?? name.trim()[0] ?? "•";
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold",
        className,
      )}
      style={{
        width: size,
        height: size,
        ...toneFor(seed),
        fontSize: Math.round(size * 0.42),
      }}
    >
      {letter}
    </span>
  );
}
