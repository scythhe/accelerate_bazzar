# Accelerate — Design System

This replaces the design section (§5) of `UI_BUILD_PROMPT.md` entirely. Where the
two conflict, this file wins.

The previous spec described restraint without defining a system, which produced a
flat, generic interface. This file defines the system with actual numbers. Follow
them literally.

---

## 1. Where the personality lives

This interface gets exactly two distinctive elements. Everything else is quiet
infrastructure that makes those two work.

1. **The search results row** — a dense, precisely aligned price-comparison list.
   This is not a standard SaaS pattern and it is the reason someone uses
   Accelerate instead of calling six suppliers. It deserves obsessive attention.
2. **The Accelerate wordmark** — bold, geometric, angular. The only loud mark
   anywhere.

Do not try to make the interface interesting through colour, gradients,
illustration, rounded pill shapes, or decorative flourish. Distinctiveness here
comes from **density and alignment**, not decoration. Get the type scale,
spacing rhythm and row density exactly right and it will look expensive. Add
ornament and it will look like a template.

---

## 2. Typography

### Font loading — do this first and verify it

**Use Noto Sans Georgian** (variable), loaded via `next/font/google` with both
the `georgian` and `latin` subsets. It is on Google Fonts, has a real Georgian
subset drawn for the script, and covers Latin and numerals in the same family.

Do **not** use FiraGO from Fontsource or Google Fonts. FiraGO is not on Google
Fonts, and the Fontsource package ships the latin subset only — Georgian text
silently falls back to a system font. If FiraGO is currently in use, this is a
live bug: remove it.

*(Optional upgrade later: FiraGO's Georgian is more characterful and can be
self-hosted by downloading the TTFs from github.com/bBoxType/FiraGO, converting
to woff2, and subsetting. Not now. Ship on Noto.)*

**Verification step:** after wiring the font, inspect a Georgian string in
devtools and confirm Computed font-family resolves to Noto Sans Georgian. Report
the result before continuing.

### Type scale

Fixed scale. Nothing outside it.

| Token | Size / line-height | Weight | Use |
|---|---|---|---|
| `micro` | 11 / 16 | 500 | Meta labels, unit suffixes, table headers |
| `small` | 13 / 20 | 400 | Secondary text, supplier name, delivery info |
| `body` | 15 / 23 | 400 | Default body text |
| `strong` | 15 / 23 | 500 | Emphasised body, form labels |
| `title` | 17 / 24 | 500 | Row titles, product names |
| `price` | 17 / 22 | 700 | Pack price — **tabular-nums** |
| `h3` | 20 / 28 | 700 | Section headings |
| `h2` | 24 / 32 | 700 | Sub-page headings |
| `h1` | 30 / 38 | 700 | Page titles |

Georgian sits about one step larger than Latin at the same optical size, which
is why body is 15 rather than 14 and line-heights run generous.

### Rules

- `font-variant-numeric: tabular-nums` on every price, quantity and numeric
  input. No exceptions.
- Never `text-transform: uppercase`. Georgian is unicameral — it does nothing to
  Georgian and looks broken next to it. This includes table headers and button
  labels.
- `letter-spacing: 0` on all Georgian text. Only `micro` gets `0.01em`.
- Sentence case everywhere.

---

## 3. Colour

Replace the previous palette entirely. The warm cream and wine red read dated
next to a hard geometric wordmark; a neutral ramp with a black primary reads
sharp and current, and lets prices dominate.

```css
--paper:        #FFFFFF;   /* page background */
--surface:      #FAFAFA;   /* panels, table header, inset areas */
--surface-hover:#F4F4F5;   /* row hover */

--ink:          #0F0F10;   /* primary text, primary buttons */
--ink-2:        #52525B;   /* secondary text, supplier name */
--ink-3:        #A1A1AA;   /* tertiary — units, per-unit price, placeholders */

--line:         #E8E8EB;   /* default borders and dividers */
--line-strong:  #D4D4D8;   /* input borders, emphasised dividers */

--accent:       #XXXXXX;   /* Accelerate brand colour — set this */
--accent-soft:  /* accent at 8% opacity, for selected backgrounds */

--ok:           #15803D;
--warn:         #B45309;
--danger:       #B91C1C;
```

### Usage rules

- **Primary buttons are `--ink` (near-black) with white text.** Not the accent.
  This is the single biggest visual change from before — black primaries read
  decisive and modern; a coloured primary on every screen reads like a template.
- `--accent` appears only on: the active navigation item, selected filter chips,
  focus rings, and the order total figure. Four places. Nothing else.
- No gradients. No tinted section backgrounds. No coloured cards.
- Status colours appear as a 6px dot plus text in `--ink-2`. Never as a filled
  pill badge on every row — that turns a scannable list into confetti.

---

## 4. Spacing, radius, borders, shadow

**Spacing scale:** 4, 8, 12, 16, 24, 32, 48, 64. Nothing else. No arbitrary
values.

**Radius:**
- 6px — inputs, buttons, chips, steppers
- 10px — sheets, modals, dropdown panels
- 0px — table rows and dividers

Do not round anything more than 10px. Large radii and pill shapes are the
fastest way to make this look like a generic starter template.

**Borders:** 1px `--line` everywhere. Inputs use `--line-strong`. Never 2px
except on focus.

**Shadow:** exactly one, used only on floating surfaces (modal, bottom sheet,
dropdown panel, sticky cart bar):

```css
box-shadow: 0 1px 3px rgb(0 0 0 / 0.06), 0 8px 24px rgb(0 0 0 / 0.08);
```

Zero shadow on rows, buttons, inputs, or cards. Separation comes from borders
and background, not elevation.

---

## 5. Density — the thing most likely to be wrong right now

The default failure is too much padding, which makes six results fill a screen
and destroys the comparison the product exists for.

**Search result row:**
- Vertical padding 14px, horizontal 16px
- Total row height 76–84px on mobile, 68–72px on desktop
- 1px `--line` divider between rows, no gap, no card, no border-radius
- Nine to ten rows visible on a 380×800 viewport without scrolling past the fold

**Row internal layout:**

```
title       (17/500, --ink)                    price      (17/700, --ink, tabular)
meta line 1 (13/400, --ink-2)                  per-unit   (13/500, --ink-3, tabular)
meta line 2 (11/500, --ink-3)                  [stepper]
```

- 4px between the two left text lines, 2px on the right column
- Price column is right-aligned with a fixed minimum width so decimal points
  align down the whole list. Check this by screenshotting ten rows and looking
  down the column — if the decimals wander, it is wrong.

**Forms:** input height 44px, 8px between label and field, 20px between fields,
32px between field groups.

**Page:** max content width 1100px, page padding 16px mobile / 32px desktop,
section spacing 32px.

---

## 6. Components

**Button**
- Primary: `--ink` background, white text, 6px radius, height 40 (default) / 44
  (large) / 32 (small), horizontal padding 16, weight 500
- Secondary: white background, 1px `--line-strong`, `--ink` text
- Ghost: transparent, `--ink-2` text, `--surface-hover` on hover
- Destructive: white background, `--danger` text and border
- No shadows, no gradients, no transform on hover. Hover changes background only.

**Input**
- 44px height, 1px `--line-strong`, 6px radius, 12px horizontal padding
- Focus: 1px `--ink` border plus a 3px `--accent` ring at 20% opacity
- Error: `--danger` border, message below at `small` in `--danger`
- Label above at `strong`, helper text below at `small` in `--ink-3`

**Stepper**
- Single bordered unit, 36px tall, minus / value / plus in one enclosure
- Value is tabular, centred, minimum 32px wide so it does not jump between
  1 and 10
- Unit label (`თარო`, `კგ`) sits outside the control in `micro` `--ink-3`
- Disabled minus at minimum quantity, not hidden

**Filter chip**
- 32px tall, 6px radius, 1px `--line-strong`, 12px horizontal padding
- Inactive: white background, `--ink-2` text
- Active: `--accent-soft` background, `--accent` border and text
- Chevron only when it opens a menu

**Status**
- 6px dot in the status colour, 6px gap, label at `small` in `--ink-2`
- Never a filled badge

---

## 7. Motion and accessibility

- Transitions: 120ms ease-out on background and border colour only
- No transform, scale or translate on hover
- Motion only as feedback for a user action — item added to cart, order
  confirmed. No entrance animations, no scroll reveals, no skeleton shimmer
  (use a static `--surface` block)
- Focus rings visible on every interactive element, keyboard-reachable in a
  sensible order
- Respect `prefers-reduced-motion`

---

## 8. The kitchen sink page itself

It is a component inventory, not a designed screen, and it will never look like
a product. But it should still be organised: components grouped with `h3`
headings, 48px between groups, 24px between variants within a group, each variant
labelled at `micro` in `--ink-3`, and everything on `--paper` at the standard
1100px content width.

Judge the design system on the search results screen, not on this page.
