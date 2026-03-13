/* ---------------------------------------------------------------
 * parseCsv: parse a CSV buffer into RowRecord[].
 * Rule 9: function in its own folder.
 * Rule 1: no recursion.  Rule 2: bounded loops.
 * Rule 4: ≤60 lines.  Rule 5: return values checked.
 * Rule 7: no function pointers.
 * Rule 8: max 4 functions in this file.
 * --------------------------------------------------------------- */

import Papa from "papaparse";
import type { RowRecord, CellValue } from "@/types";

/**
 * Parse a CSV buffer into an array of RowRecord.
 * Returns null if parsing fails or limits exceeded.
 */
export function parseCsvBuffer(
  buffer: Buffer,
  maxRows: number,
  maxCols: number
): RowRecord[] | null {
  const text: string = buffer.toString("utf-8");
  const result = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
  });

  if (result.errors.length > 0) {
    return null;
  }
  const data: Record<string, string>[] = result.data;
  if (data.length === 0) {
    return null;
  }
  if (data.length > maxRows) {
    return null;
  }
  const firstRow: Record<string, string> | undefined = data[0];
  if (firstRow === undefined) {
    return null;
  }
  const colCount: number = Object.keys(firstRow).length;
  if (colCount > maxCols) {
    return null;
  }

  const rows: RowRecord[] = new Array<RowRecord>(data.length);
  const limit: number = data.length;
  /* Rule 2: bounded loop — max = limit (≤ maxRows) */
  for (let i = 0; i < limit; i++) {
    const raw: Record<string, string> | undefined = data[i];
    if (raw === undefined) {
      return null;
    }
    const record: RowRecord = {};
    const keys: string[] = Object.keys(raw);
    const kLen: number = keys.length;
    for (let k = 0; k < kLen; k++) {
      const key: string | undefined = keys[k];
      if (key === undefined) {
        continue;
      }
      const val: CellValue = raw[key] ?? "";
      record[key] = val;
    }
    rows[i] = record;
  }
  return rows;
}
