# Accelerate — Design System

This replaces the design section (§5) of `UI_BUILD_PROMPT.md` entirely. Where the
two conflict, this file wins.

The previous spec described restraint without defining a system, which produced a
flat, generic interface. This file defines the system with actual numbers. Follow
them literally.

---

## 1. Where the personality lives

Bazzar is a Georgian market, and the interface should feel like one: warm, tactile
and full of real food, while the part you operate stays calm and exact.

1. **Real photography.** Category tiles, the home hero, login and the distributor
   banner are photographs, not icons or illustration. A photo must show the actual
   thing named on it, with no visible brands.
2. **The product card.** A price comparison a buyer can read whole in a hurry. This
   is the reason someone uses Bazzar instead of calling six suppliers.
3. **The wordmark and awning mark** (`components/Logo.tsx`).

Colour belongs to the frame and the food. Prices, names and controls stay plain, so
nothing competes with them.

---

## 2. Typography

### Font loading — do this first and verify it

Three families, each with one job, all loaded via `next/font/google`:

- **Noto Serif Georgian** — headings and big figures (`text-h1/h2/h3`, `text-stat`)
- **Noto Sans Georgian** — everything you read or operate
- **Fraunces** — the Bazzar wordmark only

**Noto Sans Georgian** (variable) has both the `georgian` and `latin` subsets. It is on Google Fonts, has a real Georgian
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
| `micro` | 12 / 16 | 500 | Meta labels, unit suffixes, table headers |
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

Tokens live in `app/globals.css`. Colours that take an opacity modifier are defined
as `-c` channel triplets there.

| Token | Value | Use |
|---|---|---|
| `--canvas` | `#F6EFE3` | Page background |
| `--paper` | `#FFFDF9` | Cards, sheets, inputs |
| `--surface` / `--surface-hover` | `#FBF5EA` / `#F5ECDC` | Inset areas, hover |
| `--ink` / `-2` / `-3` | `#24190F` / `#54483E` / `#6E6053` | Text |
| `--line` / `--line-strong` | `#EADFCE` / `#D8C9B2` | Dividers, input borders |
| `--brand` / `--brand-deep` | `#7E1F2E` / `#561320` | Band, primary buttons, sidebar, cart bar |
| `--accent` | `#A92639` | Active states, links, focus |
| `--saffron` / `-soft` | `#E9A63A` / `#FCEFD6` | Best price, unread counts, warnings |
| `--herb-soft`, `--ok` | `#E3EFE6`, `#1F6B47` | Confirmed, money, positive changes |
| `--warn`, `--danger` | `#8F5400`, `#B3261E` | Warnings, errors |

### Usage rules

- **Pomegranate is the buyer's side; herb green is the distributor's.** Setting
  `data-persona="supplier"` on the root swaps the brand and accent colours, so you
  always know which side of the market you're on.
- Saffron is the one highlight. If everything is highlighted, nothing is.
- Every text colour holds 4.5:1 on `--canvas`. The buyer is 40+ and reading a phone
  in a hurry, so `--ink-3` is never a pale grey.
- Gradients appear only as an overlay on photographs, to keep text readable.
- Status is a soft pill in the status colour (`StatusDot`).

---

## 4. Spacing, radius, borders, shadow

**Spacing scale:** 4, 8, 12, 16, 24, 32, 48, 64.

**Radius:** 6px small tags, 10px cards, buttons and inputs (`rounded`), 16px heroes,
sheets and the cart bar (`rounded-lg`). `rounded-full` for filter chips, status
pills and avatars.

**Surfaces:** content sits on `.card`: paper, a 1px `--line` border and the soft
`shadow-card`. Hover raises it to `shadow-lift`. Overlays use `--shadow-float`.

**Icons:** Phosphor only, through `components/screens/Glyphs.tsx`: duotone for
things, bold for controls, fill for the active tab. Each idea always gets the same
icon. Don't draw inline SVGs.

---

## 5. Density — the thing most likely to be wrong right now

The default failure is too much padding, which makes six results fill a screen
and destroys the comparison the product exists for.

**Search result row:**
- A card with 12px padding and a 64px photo
- Name, price and add button share the top line; supplier and delivery run the
  full width below, since a buyer needs to read those whole
- 8px between cards on a phone, 12px in the grid

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

**Page:** content fills the screen, with page padding 16px mobile / 32px desktop
and section spacing 32px. From 768px, product lists become card grids of two to
four columns. Forms and single documents stay at 720px.

---

## 6. Components

**Button**
- Primary: `--brand` background, white text, height 40 / 44 (large) / 32 (small)
- Secondary: paper background, 1px `--line-strong`, `--ink` text
- Ghost: transparent, `--ink-2` text, `--surface-hover` on hover
- Destructive: paper background, `--danger` text and border
- A press scales to 97%

**Input**
- 44px height, 1px `--line-strong`, 6px radius, 12px horizontal padding
- Focus: 1px `--ink` border plus a 3px `--accent` ring at 20% opacity
- Error: `--danger` border, message below at `small` in `--danger`
- Label above at `strong`, helper text below at `small` in `--ink-3`

**Stepper**
- Single bordered unit, 40px tall, minus / value / plus in one enclosure
- Value is a typeable numeric field, tabular and centred, so 20kg never means
  twenty taps
- Unit label (`თარო`, `კგ`) sits outside the control in `micro` `--ink-3`
- Disabled minus at minimum quantity, not hidden

**Filter chip**
- 40px tall, fully rounded, 1px `--line-strong`
- Active: `--accent-soft` background, `--accent` border and text

**Navigation**
- Phone: a brand-coloured app bar on top and a tab bar at the thumb. The cart bar
  sits above the tab bar; the cart page swaps both for its send button.
- Desktop: the deep sidebar, with categories as small round photos

---

## 7. Friction rules

The path from opening the app to a placed order is the product. Hold these on
every change to it:

- **Login:** the last digit of the phone number and of the code are the submit.
  The session is remembered, so most days the first screen is home.
- **Search:** the box stays on the results screen, and results follow it as you
  type. No going back to search for the next item.
- **Adding:** one tap on the row, no product page or sheet in between.
- **Units:** everything is listed, priced and counted by the single piece, kg or
  litre, never the batch. Each product has a minimum: the first tap on + adds
  it, minus below it removes the line, and typed quantities round up to it. The
  trash sits right next to the stepper's plus.
- **Ordering:** cart and checkout are one screen. Delivery fields default to the
  last used values and only open on request.
- **Repeat orders:** `გამეორება` on home, then one tap to send.
- **Minimums:** a short supplier never blocks the others. Warn on the search row
  while it's still easy to fix; ready orders go, the short one stays in the cart.
- **Supplier adds:** find the item in the shared catalogue, set a price, move on
  to the next. A whole price list pastes in from Excel. Never show another
  supplier's prices here.
- Tap targets are 36px minimum for the row's add button, 40px everywhere else.

---

## 8. Motion and accessibility

- Screens ease in over 220ms (`.enter`); hover and press transitions are 120ms
- Cards lift on hover, photo tiles zoom slightly, buttons give on press
- No scroll reveals and no skeleton shimmer (use a static `--surface` block)
- Focus rings visible on every interactive element, keyboard-reachable in a
  sensible order
- Respect `prefers-reduced-motion`

---

## 9. The kitchen sink page itself

It is a component inventory, not a designed screen, and it will never look like
a product. But it should still be organised: components grouped with `h3`
headings, 48px between groups, 24px between variants within a group, each variant
labelled at `micro` in `--ink-3`, and everything on `--paper` at the standard
1100px content width.

Judge the design system on the search results screen, not on this page.
