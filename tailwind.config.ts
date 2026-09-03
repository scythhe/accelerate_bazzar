import type { Config } from "tailwindcss";

/**
 * Design tokens live in `app/globals.css` as CSS custom properties so they are
 * the single source of truth. Tailwind maps onto them here. Do not hard-code hex
 * values in components — reach for these token-backed utilities instead.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    // Deliberately small, calm scale. Sentence case only, never uppercase.
    fontSize: {
      xs: ["0.75rem", { lineHeight: "1.5" }],
      sm: ["0.8125rem", { lineHeight: "1.6" }],
      base: ["0.9375rem", { lineHeight: "1.6" }],
      lg: ["1.0625rem", { lineHeight: "1.5" }],
      xl: ["1.25rem", { lineHeight: "1.4" }],
      "2xl": ["1.5rem", { lineHeight: "1.3" }],
      "3xl": ["1.9375rem", { lineHeight: "1.2" }],
    },
    extend: {
      colors: {
        paper: "var(--paper)",
        surface: "var(--surface)",
        ink: {
          DEFAULT: "var(--ink)",
          muted: "var(--ink-muted)",
        },
        line: "var(--line)",
        accent: {
          DEFAULT: "var(--accent)",
          ink: "var(--accent-ink)",
        },
        ok: "var(--ok)",
        warn: "var(--warn)",
        danger: "var(--danger)",
      },
      fontFamily: {
        sans: ["var(--font-firago)", "Noto Sans Georgian", "system-ui", "sans-serif"],
      },
      fontWeight: {
        normal: "400",
        medium: "500",
        bold: "700",
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        md: "8px",
        lg: "12px",
      },
      spacing: {
        // 44px minimum tap target, referenced directly by primitives.
        tap: "2.75rem",
      },
      boxShadow: {
        sheet: "0 -8px 40px -12px rgba(28, 27, 25, 0.18)",
        modal: "0 24px 60px -12px rgba(28, 27, 25, 0.24)",
        pop: "0 8px 28px -8px rgba(28, 27, 25, 0.18)",
      },
      transitionDuration: {
        DEFAULT: "150ms",
      },
    },
  },
  plugins: [],
};

export default config;
