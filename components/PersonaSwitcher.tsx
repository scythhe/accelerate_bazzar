"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Sheet, cn } from "@/components/ui";
import { useDemo, type Persona } from "@/lib/store/DemoContext";
import { BUYER, supplierById, SUPPLIER_PERSONA_ID } from "@/lib/mock/data";

const OPTIONS: { value: Persona; label: string; sub: string }[] = [
  { value: "buyer", label: "რესტორანი", sub: BUYER.displayName },
  {
    value: "supplier",
    label: "მომწოდებელი",
    sub: supplierById(SUPPLIER_PERSONA_ID).displayName,
  },
];

// Small persistent control to flip between the two personas and reset the demo
// (DEMO_PROMPT.md §9). Floating bottom-left so it clears the page's own bottom
// actions; the demo is unusable without it.
export function PersonaSwitcher() {
  const router = useRouter();
  const { persona, setPersona, resetDemo } = useDemo();
  const [open, setOpen] = useState(false);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 7000);
    return () => clearTimeout(t);
  }, []);

  const current = OPTIONS.find((o) => o.value === persona)!;

  const choose = (p: Persona) => {
    setPersona(p);
    setOpen(false);
    setShowHint(false);
    // Land where that persona has something to react to: the buyer on their
    // orders list (so a just-confirmed order is visible), the supplier on the
    // inbox.
    router.push(p === "buyer" ? "/orders" : "/");
  };

  const reset = () => {
    resetDemo();
    setOpen(false);
    router.push("/");
  };

  return (
    <>
      {showHint && (
        <div className="fixed bottom-14 left-3 z-40 max-w-[220px] motion-safe:animate-[hint-in_200ms_ease-out]">
          <div className="flex items-start gap-2 rounded-lg bg-ink px-3 py-2.5 text-small text-white shadow-float">
            <span className="flex-1">
              აქედან გადაერთეთ „რესტორანი“ და „მომწოდებელი“ ხედებს შორის
            </span>
            <button
              type="button"
              onClick={() => setShowHint(false)}
              aria-label="მინიშნების დახურვა"
              className="-mr-1 -mt-1 shrink-0 p-1 text-white/60 hover:text-white"
            >
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
                <path
                  d="m4 4 8 8M12 4l-8 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
          <div className="ml-4 h-2.5 w-2.5 -translate-y-1 rotate-45 bg-ink" aria-hidden />
          <style>{`
            @keyframes hint-in {
              from { opacity: 0; transform: translateY(6px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setShowHint(false);
        }}
        aria-label="პერსონის შეცვლა"
        className="fixed bottom-3 left-3 z-40 inline-flex h-9 items-center gap-2 rounded-full border border-line-strong bg-paper pl-2.5 pr-3 shadow-float"
      >
        <span className="relative flex h-2 w-2 shrink-0">
          {showHint && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
          )}
          <span
            aria-hidden
            className={cn(
              "relative h-2 w-2 rounded-full",
              persona === "buyer" ? "bg-accent" : "bg-ok",
            )}
          />
        </span>
        <span className="text-small font-medium text-ink">{current.label}</span>
        <svg
          viewBox="0 0 16 16"
          className="h-3.5 w-3.5 text-ink-3"
          fill="none"
          aria-hidden
        >
          <path
            d="M5 7l3-3 3 3M5 9l3 3 3-3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title="დემოს პერსონა"
        description="აირჩიეთ, ვისი თვალით უნდა ნახოთ აპლიკაცია"
        footer={
          <Button variant="secondary" onClick={reset}>
            დემოს განულება
          </Button>
        }
      >
        <div className="flex flex-col gap-2">
          {OPTIONS.map((o) => {
            const active = o.value === persona;
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => choose(o.value)}
                aria-pressed={active}
                className={cn(
                  "flex items-center justify-between rounded border px-3 py-3 text-left transition-colors",
                  active
                    ? "border-accent bg-accent-soft"
                    : "border-line-strong hover:bg-surface-hover",
                )}
              >
                <span>
                  <span className="block text-strong text-ink">{o.label}</span>
                  <span className="block text-small text-ink-2">{o.sub}</span>
                </span>
                {active && (
                  <svg
                    viewBox="0 0 16 16"
                    className="h-4 w-4 text-accent"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="m3 8 3.5 3.5L13 5"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </Sheet>
    </>
  );
}
