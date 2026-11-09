import type { Config } from "tailwindcss";

/**
 * Tokens live in app/globals.css as CSS custom properties. Colours that need an
 * opacity modifier (bg-brand/80) are defined as "-c" channel triplets there. This file maps
 * Tailwind utilities onto them and locks the type scale, spacing rhythm, radius
 * set and the single shadow (DESIGN_SYSTEM.md §2–§4).
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    // Fixed type scale — nothing outside it (DESIGN_SYSTEM.md §2).
    // [size, { lineHeight, fontWeight, letterSpacing }]
    fontSize: {
      micro: ["12px", { lineHeight: "16px", fontWeight: "500", letterSpacing: "0.01em" }],
      small: ["13px", { lineHeight: "20px", fontWeight: "400" }],
      body: ["15px", { lineHeight: "23px", fontWeight: "400" }],
      strong: ["15px", { lineHeight: "23px", fontWeight: "500" }],
      title: ["17px", { lineHeight: "24px", fontWeight: "500" }],
      price: ["17px", { lineHeight: "22px", fontWeight: "700" }],
      h3: ["20px", { lineHeight: "28px", fontWeight: "700" }],
      h2: ["24px", { lineHeight: "32px", fontWeight: "700" }],
      h1: ["30px", { lineHeight: "38px", fontWeight: "700" }],
      // Hero figures only — KPI cards, plan price, grand totals. Legible
      // across a table during a live pitch, not just in-hand.
      stat: ["34px", { lineHeight: "38px", fontWeight: "800" }],
    },
    // Spacing rhythm — 4/8/12/16/24/32/48/64 only. These map onto Tailwind's
    // default 1/2/3/4/6/8/12/16 steps; `row-y` is the one documented exception
    // (16px search-result row padding, DESIGN_SYSTEM.md §5).
    extend: {
      colors: {
        canvas: "var(--canvas)",
        paper: "rgb(var(--paper-c) / <alpha-value>)",
        brand: {
          DEFAULT: "rgb(var(--brand-c) / <alpha-value>)",
          deep: "rgb(var(--brand-deep-c) / <alpha-value>)",
        },
        saffron: {
          DEFAULT: "rgb(var(--saffron-c) / <alpha-value>)",
          soft: "var(--saffron-soft)",
        },
        herb: {
          soft: "var(--herb-soft)",
        },
        surface: {
          DEFAULT: "var(--surface)",
          hover: "var(--surface-hover)",
        },
        ink: {
          DEFAULT: "rgb(var(--ink-c) / <alpha-value>)",
          2: "var(--ink-2)",
          3: "var(--ink-3)",
        },
        line: {
          DEFAULT: "var(--line)",
          strong: "var(--line-strong)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          soft: "var(--accent-soft)",
          ring: "var(--accent-ring)",
        },
        ok: "var(--ok)",
        warn: "var(--warn)",
        danger: "rgb(var(--danger-c) / <alpha-value>)",
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "Noto Sans Georgian",
          "system-ui",
          "sans-serif",
        ],
        logo: ["var(--font-logo)", "Georgia", "serif"],
      },
      spacing: {
        "row-y": "16px",
      },
      borderRadius: {
        none: "0px",
        sm: "6px",
        DEFAULT: "10px",
        md: "10px",
        lg: "16px",
      },
      boxShadow: {
        none: "none",
        float: "var(--shadow-float)",
        // Warm, low and soft: cards sit on the page rather than float over it.
        card: "0 1px 2px rgb(60 30 10 / 0.05), 0 2px 10px rgb(60 30 10 / 0.05)",
        lift: "0 2px 4px rgb(60 30 10 / 0.07), 0 8px 22px rgb(60 30 10 / 0.1)",
      },
      transitionDuration: {
        DEFAULT: "120ms",
      },
      transitionTimingFunction: {
        DEFAULT: "cubic-bezier(0, 0, 0.2, 1)", // ease-out
      },
    },
  },
  plugins: [],
};

export default config;
