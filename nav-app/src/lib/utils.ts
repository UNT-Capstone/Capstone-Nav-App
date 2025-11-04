// src/lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge class names dynamically.
 * Combines `clsx` and `tailwind-merge` to handle Tailwind CSS class conflicts.
 *
 * @param inputs - Class names or conditional class objects
 * @returns A single string of merged class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}