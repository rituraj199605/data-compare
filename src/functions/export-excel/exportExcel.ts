/* ---------------------------------------------------------------
 * exportExcel: export comparison diffs to an XLSX buffer.
 * Rule 9: function in own folder.
 * Rule 1: no recursion.  Rule 2: bounded loops.
 * Rule 4: ≤60 lines/fn.  Rule 8: max 4 functions.
 * --------------------------------------------------------------- */

import * as XLSX from "xlsx";
import type { CellDiff, ComparisonSummary } from "@/types";

/** Build the summary sheet data. */
function buildSummarySheet(
  summary: ComparisonSummary
): Record<string, string | number>[] {
  return [
    { Metric: "Rows in File A", Value: summary.totalRowsA },
    { Metric: "Rows in File B", Value: summary.totalRowsB },
    { Metric: "Matched Rows", Value: summary.matchedRows },
    { Metric: "Mismatched Rows", Value: summary.mismatchedRows },
    { Metric: "Rows Only in A", Value: summary.rowsOnlyInA },
    { Metric: "Rows Only in B", Value: summary.rowsOnlyInB },
  ];
}

/** Build the detail sheet data from diffs. */
function buildDetailSheet(
  diffs: readonly CellDiff[]
): Record<string, string>[] {
  const rows: Record<string, string>[] = [];
  const limit: number = diffs.length;
  for (let i = 0; i < limit; i++) {
    const d: CellDiff | undefined = diffs[i];
    if (d === undefined) { continue; }
    rows.push({
      "Row Index": String(d.rowIndex),
      "Row Key": d.rowKeyDisplay,
      Column: d.columnName,
      "Value A": d.valueA ?? "(missing)",
      "Value B": d.valueB ?? "(missing)",
      "Diff Kind": d.kind,
    });
  }
  return rows;
}

/**
 * Export diffs to an Excel workbook buffer.
 * Contains a Summary sheet and a Details sheet.
 */
export function exportDiffsToExcel(
  summary: ComparisonSummary,
  diffs: readonly CellDiff[]
): Buffer {
  const wb: XLSX.WorkBook = XLSX.utils.book_new();

  const summaryData = buildSummarySheet(summary);
  const ws1: XLSX.WorkSheet = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, ws1, "Summary");

  const detailData = buildDetailSheet(diffs);
  const ws2: XLSX.WorkSheet = XLSX.utils.json_to_sheet(detailData);
  XLSX.utils.book_append_sheet(wb, ws2, "Details");

  const buf: Buffer = XLSX.write(wb, {
    type: "buffer",
    bookType: "xlsx",
  }) as Buffer;
  return buf;
}
