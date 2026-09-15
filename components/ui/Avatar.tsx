import { cn } from "./cn";

function hueFromString(s: string): number {
  let x = 0;
  for (let i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) >>> 0;
  return x % 360;
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
  const hue = hueFromString(seed);
  const letter = name.match(/[Ⴀ-ჿ]/)?.[0] ?? name.trim()[0] ?? "•";
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-medium",
        className,
      )}
      style={{
        width: size,
        height: size,
        backgroundColor: `hsl(${hue} 48% 92%)`,
        color: `hsl(${hue} 42% 32%)`,
        fontSize: Math.round(size * 0.42),
      }}
    >
      {letter}
    </span>
  );
}
