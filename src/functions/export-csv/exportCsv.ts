/* ---------------------------------------------------------------
 * exportCsv: export comparison diffs to a CSV buffer.
 * Rule 9: function in own folder.
 * Rule 1: no recursion.  Rule 2: bounded loops.
 * Rule 4: ≤60 lines.  Rule 8: max 4 functions.
 * --------------------------------------------------------------- */

import type { CellDiff, ComparisonSummary } from "@/types";

/** Escape a CSV field value (wrap in quotes if needed). */
function escapeCsvField(value: string): string {
  if (
    value.includes(",") ||
    value.includes('"') ||
    value.includes("\n")
  ) {
    return '"' + value.replace(/"/g, '""') + '"';
  }
  return value;
}

/**
 * Build a CSV string from comparison results.
 * Returns the CSV as a Buffer.
 */
export function exportDiffsToCsv(
  summary: ComparisonSummary,
  diffs: readonly CellDiff[]
): Buffer {
  const lines: string[] = [];

  /* Summary header */
  lines.push("=== COMPARISON SUMMARY ===");
  lines.push(`Rows in File A,${summary.totalRowsA}`);
  lines.push(`Rows in File B,${summary.totalRowsB}`);
  lines.push(`Matched Rows,${summary.matchedRows}`);
  lines.push(`Mismatched Rows,${summary.mismatchedRows}`);
  lines.push(`Rows Only in A,${summary.rowsOnlyInA}`);
  lines.push(`Rows Only in B,${summary.rowsOnlyInB}`);
  lines.push("");

  /* Detail header */
  lines.push("Row Index,Row Key,Column,Value A,Value B,Diff Kind");

  /* Detail rows — Rule 2: bounded */
  const limit: number = diffs.length;
  for (let i = 0; i < limit; i++) {
    const d: CellDiff | undefined = diffs[i];
    if (d === undefined) { continue; }
    const row: string = [
      String(d.rowIndex),
      escapeCsvField(d.rowKeyDisplay),
      escapeCsvField(d.columnName),
      escapeCsvField(d.valueA ?? "(missing)"),
      escapeCsvField(d.valueB ?? "(missing)"),
      d.kind,
    ].join(",");
    lines.push(row);
  }

  return Buffer.from(lines.join("\n"), "utf-8");
}
