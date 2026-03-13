/* ---------------------------------------------------------------
 * buildSummary: aggregate CellDiff[] into ComparisonSummary.
 * Rule 9: function in own folder.
 * Rule 1: no recursion.  Rule 2: bounded loops.
 * Rule 4: ≤60 lines/fn.  Rule 8: max 4 functions.
 * --------------------------------------------------------------- */

import type {
  ParsedFile,
  CellDiff,
  ComparisonOptions,
  ComparisonSummary,
  ColumnDiffSummary,
} from "@/types";

/** Count unique row indices that have at least one diff. */
function countMismatchedRows(diffs: readonly CellDiff[]): number {
  const seen = new Set<number>();
  const limit: number = diffs.length;
  for (let i = 0; i < limit; i++) {
    const d: CellDiff | undefined = diffs[i];
    if (d === undefined) { continue; }
    if (d.kind === "mismatch" || d.kind === "type_diff") {
      seen.add(d.rowIndex);
    }
  }
  return seen.size;
}

/** Count unique rows that exist only in A or only in B. */
function countOnlyInSide(
  diffs: readonly CellDiff[],
  kind: "missing_a" | "missing_b"
): number {
  const seen = new Set<number>();
  const limit: number = diffs.length;
  for (let i = 0; i < limit; i++) {
    const d: CellDiff | undefined = diffs[i];
    if (d === undefined) { continue; }
    if (d.kind === kind) { seen.add(d.rowIndex); }
  }
  return seen.size;
}

/** Build per-column diff summaries. */
function buildColumnSummaries(
  columns: readonly string[],
  diffs: readonly CellDiff[]
): ColumnDiffSummary[] {
  const map = new Map<string, ColumnDiffSummary>();
  const cLen: number = columns.length;
  for (let c = 0; c < cLen; c++) {
    const col: string | undefined = columns[c];
    if (col === undefined) { continue; }
    map.set(col, {
      columnName: col, mismatchCount: 0,
      typeDiffCount: 0, missingACount: 0,
      missingBCount: 0, totalDiffs: 0,
    });
  }
  const dLen: number = diffs.length;
  for (let i = 0; i < dLen; i++) {
    const d: CellDiff | undefined = diffs[i];
    if (d === undefined) { continue; }
    const entry: ColumnDiffSummary | undefined = map.get(d.columnName);
    if (entry === undefined) { continue; }
    const updated: ColumnDiffSummary = {
      ...entry,
      mismatchCount: entry.mismatchCount + (d.kind === "mismatch" ? 1 : 0),
      typeDiffCount: entry.typeDiffCount + (d.kind === "type_diff" ? 1 : 0),
      missingACount: entry.missingACount + (d.kind === "missing_a" ? 1 : 0),
      missingBCount: entry.missingBCount + (d.kind === "missing_b" ? 1 : 0),
      totalDiffs: entry.totalDiffs + 1,
    };
    map.set(d.columnName, updated);
  }
  const result: ColumnDiffSummary[] = [];
  const entries = Array.from(map.values());
  const eLen: number = entries.length;
  for (let e = 0; e < eLen; e++) {
    const val: ColumnDiffSummary | undefined = entries[e];
    if (val !== undefined && val.totalDiffs > 0) { result.push(val); }
  }
  return result;
}

/** Build the top-level comparison summary. */
export function buildSummary(
  fileA: ParsedFile,
  fileB: ParsedFile,
  diffs: readonly CellDiff[],
  options: ComparisonOptions
): ComparisonSummary {
  const rowsA: number = fileA.rows.length;
  const rowsB: number = fileB.rows.length;
  const mismatchedRows: number = countMismatchedRows(diffs);
  const onlyA: number = countOnlyInSide(diffs, "missing_b");
  const onlyB: number = countOnlyInSide(diffs, "missing_a");
  const matched: number = Math.min(rowsA, rowsB) - mismatchedRows;
  const cols: readonly string[] = fileA.meta.columnNames;
  const colSummaries: ColumnDiffSummary[] = buildColumnSummaries(cols, diffs);

  return {
    totalRowsA: rowsA,
    totalRowsB: rowsB,
    matchedRows: Math.max(matched, 0),
    mismatchedRows,
    rowsOnlyInA: onlyA,
    rowsOnlyInB: onlyB,
    columnSummaries: colSummaries,
    comparedColumns: cols,
  };
}
