import { clsx, type ClassValue } from "clsx";

/** Tiny class joiner. No tailwind-merge — keep conflicts out by construction. */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
