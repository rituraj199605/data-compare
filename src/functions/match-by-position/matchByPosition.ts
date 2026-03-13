/* ---------------------------------------------------------------
 * matchByPosition: compare rows at the same index.
 * Rule 9: function in own folder.
 * Rule 1: no recursion.  Rule 2: bounded loops (MAX_ROWS).
 * Rule 4: ≤60 lines/fn.  Rule 8: max 4 functions.
 * --------------------------------------------------------------- */

import type {
  ParsedFile,
  ComparisonOptions,
  CellDiff,
  DiffKind,
  RowRecord,
} from "@/types";
import { MAX_ROWS } from "@/initializers/init-config/initConfig";
import { compareCellValues } from "@/functions/compare-cells/compareCells";

/**
 * Compare rows positionally (row 0 vs row 0, row 1 vs row 1, …).
 * Only compares up to min(rowsA, rowsB, MAX_ROWS).
 * Returns null on invalid input.
 */
export function matchByPosition(
  fileA: ParsedFile,
  fileB: ParsedFile,
  options: ComparisonOptions
): CellDiff[] | null {
  const countA: number = fileA.rows.length;
  const countB: number = fileB.rows.length;
  if (countA === 0 && countB === 0) {
    return null;
  }

  const limit: number = Math.min(countA, countB, MAX_ROWS);
  const columns: readonly string[] = fileA.meta.columnNames;
  const cLen: number = columns.length;
  const diffs: CellDiff[] = [];

  /* Rule 2: bounded — limit ≤ MAX_ROWS */
  for (let i = 0; i < limit; i++) {
    const rowA: RowRecord | undefined = fileA.rows[i];
    const rowB: RowRecord | undefined = fileB.rows[i];
    if (rowA === undefined || rowB === undefined) {
      continue;
    }
    /* Inner loop bounded by cLen ≤ MAX_COLUMNS */
    for (let c = 0; c < cLen; c++) {
      const col: string | undefined = columns[c];
      if (col === undefined) { continue; }
      const vA: string = rowA[col] ?? "";
      const vB: string = rowB[col] ?? "";
      const kind: DiffKind | null = compareCellValues(vA, vB, options);
      if (kind === null) { continue; }
      diffs.push({
        rowIndex: i,
        rowKeyDisplay: String(i),
        columnName: col,
        valueA: vA,
        valueB: vB,
        kind,
      });
    }
  }

  return diffs;
}
