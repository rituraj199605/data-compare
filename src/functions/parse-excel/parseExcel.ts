/* ---------------------------------------------------------------
 * parseExcel: parse an XLSX buffer into RowRecord[].
 * Rule 9: function in its own folder.
 * Rule 1: no recursion.  Rule 2: bounded loops.
 * Rule 4: ≤60 lines.  Rule 5: return values checked.
 * Rule 7: no function pointers.
 * --------------------------------------------------------------- */

import * as XLSX from "xlsx";
import type { RowRecord, CellValue } from "@/types";

/**
 * Parse an Excel buffer into an array of RowRecord.
 * Uses only the first sheet. Returns null on failure.
 */
export function parseExcelBuffer(
  buffer: Buffer,
  maxRows: number,
  maxCols: number
): RowRecord[] | null {
  let workbook: XLSX.WorkBook;
  try {
    workbook = XLSX.read(buffer, { type: "buffer" });
  } catch {
    return null;
  }

  const sheetName: string | undefined = workbook.SheetNames[0];
  if (sheetName === undefined) {
    return null;
  }
  const sheet: XLSX.WorkSheet | undefined = workbook.Sheets[sheetName];
  if (sheet === undefined) {
    return null;
  }

  const raw: Record<string, string>[] = XLSX.utils.sheet_to_json<
    Record<string, string>
  >(sheet, { defval: "", raw: false });

  if (raw.length === 0 || raw.length > maxRows) {
    return null;
  }
  const first: Record<string, string> | undefined = raw[0];
  if (first === undefined) {
    return null;
  }
  if (Object.keys(first).length > maxCols) {
    return null;
  }

  const rows: RowRecord[] = new Array<RowRecord>(raw.length);
  const limit: number = raw.length;
  for (let i = 0; i < limit; i++) {
    const entry: Record<string, string> | undefined = raw[i];
    if (entry === undefined) {
      return null;
    }
    const record: RowRecord = {};
    const keys: string[] = Object.keys(entry);
    const kLen: number = keys.length;
    for (let k = 0; k < kLen; k++) {
      const key: string | undefined = keys[k];
      if (key === undefined) { continue; }
      const val: CellValue = String(entry[key] ?? "");
      record[key] = val;
    }
    rows[i] = record;
  }
  return rows;
}
