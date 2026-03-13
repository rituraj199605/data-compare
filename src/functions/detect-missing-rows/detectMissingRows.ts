/* ---------------------------------------------------------------
 * detectMissingRows: find rows present in one file but not other.
 * Rule 9: function in own folder.
 * Rule 1: no recursion.  Rule 2: bounded loops.
 * Rule 4: ≤60 lines/fn.  Rule 8: max 4 functions.
 * --------------------------------------------------------------- */

import type {
  ParsedFile,
  ComparisonOptions,
  CellDiff,
  RowRecord,
} from "@/types";
import { MAX_ROWS } from "@/initializers/init-config/initConfig";

/** Build a composite key from a row. */
function makeKey(row: RowRecord, cols: readonly string[]): string {
  let key = "";
  const limit: number = cols.length;
  for (let k = 0; k < limit; k++) {
    const col: string | undefined = cols[k];
    if (col === undefined) { continue; }
    key = key + (k > 0 ? "|||" : "") + (row[col] ?? "");
  }
  return key;
}

/** Build a Set of all keys in a file. */
function buildKeySet(
  file: ParsedFile,
  keyCols: readonly string[]
): Set<string> {
  const set = new Set<string>();
  const limit: number = Math.min(file.rows.length, MAX_ROWS);
  for (let i = 0; i < limit; i++) {
    const row: RowRecord | undefined = file.rows[i];
    if (row === undefined) { continue; }
    set.add(makeKey(row, keyCols));
  }
  return set;
}

/**
 * Detect rows missing in either file.
 * For positional mode: rows beyond min length are "missing".
 * For key mode: rows whose key doesn't exist in the other file.
 */
export function detectMissingRows(
  fileA: ParsedFile,
  fileB: ParsedFile,
  options: ComparisonOptions
): CellDiff[] {
  const diffs: CellDiff[] = [];
  if (options.matchMode === "positional") {
    addPositionalMissing(fileA, fileB, diffs);
    return diffs;
  }
  const keyCols: readonly string[] = options.keyColumns;
  const setA: Set<string> = buildKeySet(fileA, keyCols);
  const setB: Set<string> = buildKeySet(fileB, keyCols);
  addKeyMissing(fileB, keyCols, setA, "missing_a", diffs);
  addKeyMissing(fileA, keyCols, setB, "missing_b", diffs);
  return diffs;
}

/** Add diffs for rows beyond min length in positional mode. */
function addPositionalMissing(
  a: ParsedFile, b: ParsedFile, out: CellDiff[]
): void {
  const minLen: number = Math.min(a.rows.length, b.rows.length);
  const maxLen: number = Math.min(
    Math.max(a.rows.length, b.rows.length), MAX_ROWS
  );
  const isALonger: boolean = a.rows.length > b.rows.length;
  const source: ParsedFile = isALonger ? a : b;
  const kind = isALonger ? "missing_b" as const : "missing_a" as const;
  for (let i = minLen; i < maxLen; i++) {
    const row: RowRecord | undefined = source.rows[i];
    if (row === undefined) { continue; }
    const cols = source.meta.columnNames;
    const cLen: number = cols.length;
    for (let c = 0; c < cLen; c++) {
      const col: string | undefined = cols[c];
      if (col === undefined) { continue; }
      const val: string = row[col] ?? "";
      out.push({
        rowIndex: i, rowKeyDisplay: String(i), columnName: col,
        valueA: kind === "missing_b" ? val : null,
        valueB: kind === "missing_a" ? val : null,
        kind,
      });
    }
  }
}

/** Add diffs for keys in `file` that are NOT in `otherSet`. */
function addKeyMissing(
  file: ParsedFile, keyCols: readonly string[],
  otherSet: Set<string>,
  kind: "missing_a" | "missing_b",
  out: CellDiff[]
): void {
  const limit: number = Math.min(file.rows.length, MAX_ROWS);
  for (let i = 0; i < limit; i++) {
    const row: RowRecord | undefined = file.rows[i];
    if (row === undefined) { continue; }
    const key: string = makeKey(row, keyCols);
    if (otherSet.has(key)) { continue; }
    const cols = file.meta.columnNames;
    const cLen: number = cols.length;
    for (let c = 0; c < cLen; c++) {
      const col: string | undefined = cols[c];
      if (col === undefined) { continue; }
      const val: string = row[col] ?? "";
      out.push({
        rowIndex: i, rowKeyDisplay: key, columnName: col,
        valueA: kind === "missing_b" ? val : null,
        valueB: kind === "missing_a" ? val : null,
        kind,
      });
    }
  }
}
