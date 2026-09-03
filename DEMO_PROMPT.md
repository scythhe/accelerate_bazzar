# Accelerate — Demo Build

This replaces the scope in `UI_BUILD_PROMPT.md`. Keep using `CLAUDE.md` for
context and `DESIGN_SYSTEM.md` for all visual decisions.

## Purpose

One thing only: a clickable demo, on a phone, that walks a restaurant manager
through the entire flow end to end so he can react to it. It is a conversation
prop, not a product.

Everything is judged on a 380px viewport. Desktop does not matter — do not spend
any time on it beyond not breaking.

## Scope — nine screens

Build only these. Nothing else.

**Buyer**
1. **Home** — the search field, plus a category strip and two recent orders
   below it.
2. **Search results** — the dense comparison list per `DESIGN_SYSTEM.md` §5.
   This is the screen the whole demo hinges on.
3. **Cart** — grouped by supplier, each group showing its subtotal against that
   supplier's minimum order, with a visible warning when a group is short.
4. **Checkout** — delivery address, requested delivery date, note. One screen.
5. **Order placed** — confirmation showing that three separate orders were
   created, one per supplier.
6. **Orders** — list, and a detail view with items and a simple status timeline.

**Supplier**
7. **Inbox** — incoming orders, newest first, unconfirmed ones visually distinct.
8. **Order detail** — the items, the buyer, and confirm / reject actions.

**Shared**
9. **Persona switcher** — a small persistent control to flip between
   "რესტორანი" and "მომწოდებელი". Build this first; the demo is unusable
   without it.

## The demo path — this must work perfectly, in this order

1. Open on the buyer home
2. Search `კვერცხი`
3. See eight suppliers with different prices, aligned for comparison
4. Add items from three different suppliers
5. Open the cart — see it grouped, see one group below its minimum
6. Add one more item to clear the minimum
7. Check out
8. See three orders created
9. Switch persona to supplier
10. See the new order in the inbox
11. Confirm it
12. Switch back to buyer, see the order now confirmed

Walk this path yourself and fix anything that breaks before reporting done.
Any dead end mid-path kills the demo.

## Explicitly not in this build

Login, OTP, registration, admin screens, the mapping queue, supplier catalogue
management, product forms, CSV import, delivery settings, company profiles,
settings pages, team members, desktop layouts, empty search states beyond one
basic case.

The app opens directly into the buyer home with a persona already active. There
is no authentication of any kind.

## Data

In-memory mock data as specified before, but the realism bar is higher than
usual: this is being shown to someone with fifteen years in Tbilisi restaurant
supply, and one implausible price will cost more credibility than a rough edge
in the UI.

- Eight suppliers with Georgian company names that sound like real Tbilisi
  distributors
- Genuinely different prices for the same canonical items, so the comparison has
  something to show
- Realistic GEL prices, pack sizes and minimum order values
- Different delivery districts, cutoff times and lead times per supplier
- Enough catalogue depth that `კვერცხი`, `ხახვი`, `მწნილი` and `ზეთი` all
  return good results — those are the four terms most likely to get typed during
  a live demo

Orders and cart state live in React context in memory. Add a small **"დემოს
განულება"** (reset demo) control in the persona switcher so the whole path can
be run again from scratch in front of a second person.

## Done when

The twelve-step path above runs cleanly on a phone, in Georgian, without a dead
end, and the reset control returns it to the start.
