"use client";

import { useState } from "react";
import { cn } from "./cn";

/** First Georgian letter of a string, for the fallback tile. */
function firstLetter(s: string): string {
  const m = s.match(/[Ⴀ-ჿ]/);
  return m ? m[0] : (s.trim()[0] ?? "•");
}

export interface ThumbProps {
  src?: string;
  /** Product name — supplies the fallback letter. */
  name: string;
  className?: string;
}

// 44px square, 6px radius. Renders the image when it loads; otherwise a
// --surface tile with a 1px --line border and the first Georgian letter centred
// in --ink-3 at title size. Never a broken-image icon.
export function Thumb({ src, name, className }: ThumbProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <span
      className={cn(
        "block h-11 w-11 shrink-0 overflow-hidden rounded",
        className,
      )}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          width={44}
          height={44}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-11 w-11 object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex h-11 w-11 items-center justify-center border border-line bg-surface text-title text-ink-3"
        >
          {firstLetter(name)}
        </span>
      )}
    </span>
  );
}
