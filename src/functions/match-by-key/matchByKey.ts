/* ---------------------------------------------------------------
 * matchByKey: match rows across two files using key column(s).
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

/** Build a composite key string from a row's key columns. */
function buildRowKey(
  row: RowRecord,
  keyColumns: readonly string[]
): string {
  let key = "";
  const limit: number = keyColumns.length;
  for (let k = 0; k < limit; k++) {
    const col: string | undefined = keyColumns[k];
    if (col === undefined) { continue; }
    const val: string = row[col] ?? "";
    key = key + (k > 0 ? "|||" : "") + val;
  }
  return key;
}

/** Build a Map from key → row index for file A. */
function buildKeyIndex(
  file: ParsedFile,
  keyColumns: readonly string[]
): Map<string, number> {
  const map = new Map<string, number>();
  const limit: number = Math.min(file.rows.length, MAX_ROWS);
  for (let i = 0; i < limit; i++) {
    const row: RowRecord | undefined = file.rows[i];
    if (row === undefined) { continue; }
    const key: string = buildRowKey(row, keyColumns);
    map.set(key, i);
  }
  return map;
}

/**
 * Match rows by key columns and collect cell diffs.
 * Returns null if key columns are invalid.
 */
export function matchByKey(
  fileA: ParsedFile,
  fileB: ParsedFile,
  options: ComparisonOptions
): CellDiff[] | null {
  if (options.keyColumns.length === 0) {
    return null;
  }
  const indexA: Map<string, number> = buildKeyIndex(fileA, options.keyColumns);
  const diffs: CellDiff[] = [];
  const colsA: readonly string[] = fileA.meta.columnNames;
  const limitB: number = Math.min(fileB.rows.length, MAX_ROWS);

  for (let bi = 0; bi < limitB; bi++) {
    const rowB: RowRecord | undefined = fileB.rows[bi];
    if (rowB === undefined) { continue; }
    const keyB: string = buildRowKey(rowB, options.keyColumns);
    const ai: number | undefined = indexA.get(keyB);
    if (ai === undefined) { continue; }
    const rowA: RowRecord | undefined = fileA.rows[ai];
    if (rowA === undefined) { continue; }
    collectRowDiffs(rowA, rowB, keyB, bi, colsA, options, diffs);
  }
  return diffs;
}

/** Compare every column of two matched rows. */
function collectRowDiffs(
  rowA: RowRecord, rowB: RowRecord, keyDisp: string,
  rowIdx: number, columns: readonly string[],
  options: ComparisonOptions, out: CellDiff[]
): void {
  const cLen: number = columns.length;
  for (let c = 0; c < cLen; c++) {
    const col: string | undefined = columns[c];
    if (col === undefined) { continue; }
    const vA: string = rowA[col] ?? "";
    const vB: string = rowB[col] ?? "";
    const kind: DiffKind | null = compareCellValues(vA, vB, options);
    if (kind === null) { continue; }
    out.push({
      rowIndex: rowIdx, rowKeyDisplay: keyDisp,
      columnName: col, valueA: vA, valueB: vB, kind,
    });
  }
}
