/**
 * Currency is `₾`, written after the number with a space, always two decimals
 * (UI_BUILD_PROMPT.md §6). Tabular figures + fixed decimals keep decimal points
 * aligned down a price column.
 */
export function gel(amount: number): string {
  return `${amount.toFixed(2)} ₾`;
}

/**
 * Per-base-unit comparison figure shown directly beneath the pack price in the
 * same right-aligned column, e.g. "0.40/ცალი". The ₾ is carried by the price
 * above it — repeating it here only costs width in a dense row.
 */
export function gelPerUnit(amount: number, unit: string): string {
  return `${amount.toFixed(2)}/${unit}`;
}
