/**
 * Currency is `₾`, written after the number with a space, always two decimals
 * (UI_BUILD_PROMPT.md §6). Tabular figures + fixed decimals keep decimal points
 * aligned down a price column.
 */
export function gel(amount: number): string {
  return `${amount.toFixed(2)} ₾`;
}

/** Per-base-unit comparison figure, e.g. "0.40 ₾/ცალი". */
export function gelPerUnit(amount: number, unit: string): string {
  return `${amount.toFixed(2)} ₾/${unit}`;
}
