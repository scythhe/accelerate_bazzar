"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Input } from "@/components/ui";
import { Logo } from "@/components/Logo";
import { useDemo } from "@/lib/store/DemoContext";

const DEMO_CODE = "123456";
const RESEND_SECONDS = 30;

/** Accepts 599123456, 0599123456 and +995599123456 alike (V1_BUILD_PROMPT.md §2). */
function nationalDigits(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("995")) digits = digits.slice(3);
  if (digits.startsWith("0")) digits = digits.slice(1);
  return digits.slice(0, 9);
}

function formatPhone(digits: string): string {
  return [
    digits.slice(0, 3),
    digits.slice(3, 5),
    digits.slice(5, 7),
    digits.slice(7, 9),
  ]
    .filter(Boolean)
    .join(" ");
}

const isValidPhone = (digits: string) => /^5\d{8}$/.test(digits);

// Phone → code → in, with as little as possible between them: no password, no
// extra tap once a field is full, and the session is then remembered so most
// days this screen never appears (fully mocked — UI_BUILD_PROMPT.md §4).
export function Login() {
  const { login, phone: rememberedPhone } = useDemo();
  const [digits, setDigits] = useState(nationalDigits(rememberedPhone));
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phoneError, setPhoneError] = useState("");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [resendIn, setResendIn] = useState(0);
  const phoneRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (step === "phone" ? phoneRef : codeRef).current?.focus();
  }, [step]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const sendCode = (d: string) => {
    if (!isValidPhone(d)) {
      setPhoneError("შეიყვანეთ 9-ნიშნა მობილურის ნომერი, მაგ. 599 12 34 56");
      return;
    }
    setPhoneError("");
    setCode("");
    setCodeError("");
    setResendIn(RESEND_SECONDS);
    setStep("code");
  };

  const onPhoneChange = (raw: string) => {
    const next = nationalDigits(raw);
    setDigits(next);
    setPhoneError("");
    // The last digit is the submit — no button to find with busy hands.
    if (next.length === 9 && isValidPhone(next)) sendCode(next);
  };

  const onCodeChange = (raw: string) => {
    const next = raw.replace(/\D/g, "").slice(0, 6);
    setCode(next);
    setCodeError("");
    if (next.length < 6) return;
    if (next === DEMO_CODE) {
      login(`+995${digits}`);
    } else {
      setCode("");
      setCodeError("კოდი არასწორია. სცადეთ თავიდან.");
    }
  };

  return (
    <main className="relative flex min-h-dvh flex-col items-center bg-brand-deep px-4 pt-14 sm:justify-center sm:pb-16 sm:pt-0">
      <span aria-hidden="true" className="absolute inset-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/login-spices.jpg"
          alt=""
          className="h-full w-full object-cover"
        />
        <span className="absolute inset-0 bg-gradient-to-b from-brand-deep/85 via-brand/70 to-brand-deep/90" />
      </span>

      <div className="enter relative w-full max-w-[420px]">
        <Logo size="lg" className="text-white" />
        <p className="mt-3 text-title font-normal text-white/90">
          ყველა მომწოდებელი და ფასი ერთ ადგილას
        </p>

        <div className="mt-6 rounded-lg bg-paper p-5 shadow-float sm:p-6">
          {step === "phone" ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendCode(digits);
              }}
            >
              <h1 className="text-h3 text-ink">შესვლა</h1>
              <p className="mt-1 text-small text-ink-2">
                პაროლი არ გჭირდებათ — კოდს SMS-ით გამოგიგზავნით.
              </p>
              <div className="mt-4">
                <Input
                  ref={phoneRef}
                  label="ტელეფონის ნომერი"
                  leading="+995"
                  numeric
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel-national"
                  placeholder="5XX XX XX XX"
                  value={formatPhone(digits)}
                  onChange={(e) => onPhoneChange(e.target.value)}
                  error={phoneError}
                />
              </div>
              <Button type="submit" block size="lg" className="mt-4">
                კოდის მიღება
              </Button>
            </form>
          ) : (
            <>
              <h1 className="text-h3 text-ink">შეიყვანეთ კოდი</h1>
              <p className="mt-1 text-small text-ink-2">
                გამოგზავნილია ნომერზე{" "}
                <span className="tabular whitespace-nowrap font-medium text-ink">
                  +995 {formatPhone(digits)}
                </span>
              </p>
              <div className="mt-4">
                <Input
                  ref={codeRef}
                  aria-label="SMS კოდი"
                  numeric
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="······"
                  value={code}
                  onChange={(e) => onCodeChange(e.target.value)}
                  error={codeError}
                  className="text-center tracking-[0.3em]"
                />
              </div>

              <button
                type="button"
                onClick={() => onCodeChange(DEMO_CODE)}
                className="mt-3 flex min-h-11 w-full items-center justify-center gap-1.5 rounded border border-dashed border-line-strong px-3 text-small text-ink-2 transition-colors hover:bg-surface-hover"
              >
                დემო: შეეხეთ კოდის ჩასასმელად
                <span className="tabular font-medium text-ink">{DEMO_CODE}</span>
              </button>

              <div className="mt-2 flex items-center justify-between text-small">
                <button
                  type="button"
                  onClick={() => setStep("phone")}
                  className="min-h-11 text-ink-2 underline-offset-2 hover:text-ink hover:underline"
                >
                  ნომრის შეცვლა
                </button>
                {resendIn > 0 ? (
                  <span className="tabular text-ink-3">
                    ხელახლა გაგზავნა {resendIn} წმ-ში
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => sendCode(digits)}
                    className="min-h-11 font-medium text-accent underline-offset-2 hover:underline"
                  >
                    ხელახლა გაგზავნა
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
