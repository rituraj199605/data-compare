/* ---------------------------------------------------------------
 * FileParser class: reads CSV/XLSX into ParsedFile.
 * Rule 10: classes in their own folder.
 * Rule 8: 1 class in this file.
 * Rule 1: no recursion.  Rule 4: ≤60 lines per method.
 * Rule 5: every return value checked.
 * Rule 7: no function pointers.
 * --------------------------------------------------------------- */

import type {
  ParsedFile,
  ParsedFileMeta,
  RowRecord,
  CellValue,
  FileFormat,
} from "@/types";
import { MAX_ROWS, MAX_COLUMNS } from "@/initializers/init-config/initConfig";
import { parseCsvBuffer } from "@/functions/parse-csv/parseCsv";
import { parseExcelBuffer } from "@/functions/parse-excel/parseExcel";

export class FileParser {
  private readonly maxRows: number = MAX_ROWS;
  private readonly maxCols: number = MAX_COLUMNS;

  /** Detect file format from extension. Returns null on unsupported. */
  detectFormat(fileName: string): FileFormat | null {
    const lower: string = fileName.toLowerCase();
    if (lower.endsWith(".csv")) {
      return "csv";
    }
    if (lower.endsWith(".xlsx")) {
      return "xlsx";
    }
    return null;
  }

  /** Parse a buffer into a ParsedFile. */
  async parse(
    buffer: Buffer,
    fileName: string
  ): Promise<ParsedFile | null> {
    const format: FileFormat | null = this.detectFormat(fileName);
    if (format === null) {
      return null;
    }
    let rawRows: RowRecord[];
    if (format === "csv") {
      const csvResult = parseCsvBuffer(buffer, this.maxRows, this.maxCols);
      if (csvResult === null) {
        return null;
      }
      rawRows = csvResult;
    } else {
      const xlsResult = parseExcelBuffer(buffer, this.maxRows, this.maxCols);
      if (xlsResult === null) {
        return null;
      }
      rawRows = xlsResult;
    }
    if (rawRows.length === 0) {
      return null;
    }
    const firstRow: RowRecord | undefined = rawRows[0];
    if (firstRow === undefined) {
      return null;
    }
    const columnNames: string[] = Object.keys(firstRow);
    const meta: ParsedFileMeta = {
      fileName,
      format,
      totalRows: rawRows.length,
      columnNames,
    };
    const parsed: ParsedFile = { meta, rows: rawRows };
    return parsed;
  }
}
