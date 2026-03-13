/* ---------------------------------------------------------------
 * normalizeValue: normalize a cell value based on options.
 * Rule 9: function in its own folder.
 * Rule 4: ≤60 lines.  Rule 8: max 4 functions.
 * --------------------------------------------------------------- */

import type { CellValue } from "@/types";

/**
 * Normalize a cell value based on sensitivity settings.
 * Returns the normalized string.
 */
export function normalizeValue(
  value: CellValue,
  caseSensitive: boolean,
  whitespaceSensitive: boolean
): string {
  let result: string = value;
  if (!caseSensitive) {
    result = result.toLowerCase();
  }
  if (!whitespaceSensitive) {
    result = result.trim().replace(/\s+/g, " ");
  }
  return result;
}

/**
 * Check if two values are numerically equivalent within tolerance.
 * Returns true if both parse as numbers and diff ≤ tolerance.
 */
export function numericEquals(
  a: string,
  b: string,
  tolerance: number
): boolean {
  const numA: number = Number(a);
  const numB: number = Number(b);
  if (Number.isNaN(numA) || Number.isNaN(numB)) {
    return false;
  }
  return Math.abs(numA - numB) <= tolerance;
}

/**
 * Detect if two values differ in type representation.
 * E.g., "42" vs "42.0" or "true" vs "1".
 */
export function isTypeDiff(a: string, b: string): boolean {
  const numA: number = Number(a);
  const numB: number = Number(b);
  const aIsNum: boolean = !Number.isNaN(numA) && a.trim().length > 0;
  const bIsNum: boolean = !Number.isNaN(numB) && b.trim().length > 0;
  if (aIsNum !== bIsNum) {
    return true;
  }
  if (aIsNum && bIsNum && numA === numB && a.trim() !== b.trim()) {
    return true;
  }
  return false;
}
