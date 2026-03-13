/* ---------------------------------------------------------------
 * compareCells: compare two cell values and determine diff kind.
 * Rule 9: function in its own folder.
 * Rule 4: ≤60 lines.  Rule 8: max 4 functions.
 * Rule 7: no function pointers.
 * --------------------------------------------------------------- */

import type { CellValue, DiffKind, ComparisonOptions } from "@/types";
import {
  normalizeValue,
  numericEquals,
  isTypeDiff,
} from "@/functions/normalize-value/normalizeValue";

/**
 * Compare two cell values under the given options.
 * Returns null if cells are equal, or the DiffKind if different.
 */
export function compareCellValues(
  valueA: CellValue,
  valueB: CellValue,
  options: ComparisonOptions
): DiffKind | null {
  const normA: string = normalizeValue(
    valueA,
    options.caseSensitive,
    options.whitespaceSensitive
  );
  const normB: string = normalizeValue(
    valueB,
    options.caseSensitive,
    options.whitespaceSensitive
  );

  /* Exact match after normalization */
  if (normA === normB) {
    return null;
  }

  /* Check numeric tolerance */
  if (options.numericTolerance > 0) {
    const numEq: boolean = numericEquals(
      normA, normB, options.numericTolerance
    );
    if (numEq) {
      return null;
    }
  }

  /* Check if it's a type/format difference */
  const typeD: boolean = isTypeDiff(normA, normB);
  if (typeD) {
    return "type_diff";
  }

  return "mismatch";
}
