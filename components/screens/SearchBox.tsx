"use client";

import { forwardRef, useState } from "react";
import { Input, Thumb, gel } from "@/components/ui";
import { X } from "@phosphor-icons/react";
import { SearchIcon } from "./Glyphs";
import { searchSuggestions } from "@/lib/mock/search";

export interface SearchBoxProps {
  value: string;
  onChange: (next: string) => void;
  onSubmit: (query: string) => void;
  /** Off where the results update live underneath the box anyway. */
  suggest?: boolean;
  /** The home hero's bigger box. */
  large?: boolean;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
}

export const SearchBox = forwardRef<HTMLInputElement, SearchBoxProps>(
  ({ value, onChange, onSubmit, suggest = false, large = false, onFocus }, ref) => {
    const [open, setOpen] = useState(false);
    const suggestions = suggest && open ? searchSuggestions(value) : [];

    return (
      <form
        className="relative"
        onSubmit={(e) => {
          e.preventDefault();
          setOpen(false);
          onSubmit(value);
        }}
      >
        <Input
          ref={ref}
          aria-label="ძებნა"
          large={large}
          leading={<SearchIcon className="h-5 w-5 text-accent" />}
          placeholder="მაგ. კვერცხი, ხახვი, ზეთი"
          value={value}
          onChange={(e) => {
            setOpen(true);
            onChange(e.target.value);
          }}
          onFocus={(e) => {
            setOpen(true);
            onFocus?.(e);
          }}
          onBlur={() => setOpen(false)}
          enterKeyHint="search"
          autoComplete="off"
          autoCorrect="off"
          trailing={
            value && (
              <button
                type="button"
                aria-label="გასუფთავება"
                // Keep focus in the field so the next word can be typed at once.
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onChange("")}
                className="-mr-2 flex h-10 w-10 shrink-0 items-center justify-center text-ink-3 transition-colors hover:text-ink"
              >
                <X weight="bold" aria-hidden="true" className="h-4 w-4" />
              </button>
            )
          }
        />
        <button type="submit" className="sr-only">
          ძებნა
        </button>

        {suggestions.length > 0 && (
          <ul className="enter absolute inset-x-0 top-full z-30 mt-1.5 divide-y divide-line overflow-hidden rounded-lg bg-paper shadow-float">
            {suggestions.map((s) => (
              <li key={s.nameKa}>
                <button
                  type="button"
                  // mousedown beats the input's blur, which would close the list.
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setOpen(false);
                    onChange(s.nameKa);
                    onSubmit(s.nameKa);
                  }}
                  className="flex min-h-[76px] w-full items-center gap-3 px-3 py-1.5 text-left transition-colors hover:bg-surface-hover"
                >
                  <Thumb src={s.imageUrl} name={s.nameKa} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-strong text-ink">
                      {s.nameKa}
                    </span>
                    <span className="block truncate text-small text-ink-2">
                      {s.supplierCount} მომწოდებელი · {s.baseUnit}
                    </span>
                  </span>
                  <span className="shrink-0 tabular text-small font-medium text-ink-2">
                    {gel(s.cheapestPerUnit)}-დან
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </form>
    );
  },
);
SearchBox.displayName = "SearchBox";
