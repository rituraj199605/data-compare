/* ---------------------------------------------------------------
 * Core types for the data-comparison application.
 * Rule 8: max 2 classes or 4 functions per file — this file
 *         contains ONLY type/interface declarations (no classes).
 * --------------------------------------------------------------- */

/** Supported file formats */
export type FileFormat = "csv" | "xlsx";

/** A single parsed cell value (always stored as string internally) */
export type CellValue = string;

/** One row of data: column-name → cell-value */
export type RowRecord = Record<string, CellValue>;

/** Metadata returned after parsing a file */
export interface ParsedFileMeta {
  readonly fileName: string;
  readonly format: FileFormat;
  readonly totalRows: number;
  readonly columnNames: readonly string[];
}

/** Full parsed file payload */
export interface ParsedFile {
  readonly meta: ParsedFileMeta;
  readonly rows: readonly RowRecord[];
}

/** How the user wants to match rows */
export type MatchMode = "key" | "positional";

/** User-configurable comparison options */
export interface ComparisonOptions {
  readonly matchMode: MatchMode;
  readonly keyColumns: readonly string[];
  readonly caseSensitive: boolean;
  readonly whitespaceSensitive: boolean;
  readonly numericTolerance: number;
}

/** Types of difference detected between two cells */
export type DiffKind = "mismatch" | "missing_a" | "missing_b" | "type_diff";

/** A single cell-level difference */
export interface CellDiff {
  readonly rowIndex: number;
  readonly rowKeyDisplay: string;
  readonly columnName: string;
  readonly valueA: CellValue | null;
  readonly valueB: CellValue | null;
  readonly kind: DiffKind;
}

/** Per-column summary count */
export interface ColumnDiffSummary {
  readonly columnName: string;
  readonly mismatchCount: number;
  readonly typeDiffCount: number;
  readonly missingACount: number;
  readonly missingBCount: number;
  readonly totalDiffs: number;
}

/** Top-level comparison summary */
export interface ComparisonSummary {
  readonly totalRowsA: number;
  readonly totalRowsB: number;
  readonly matchedRows: number;
  readonly mismatchedRows: number;
  readonly rowsOnlyInA: number;
  readonly rowsOnlyInB: number;
  readonly columnSummaries: readonly ColumnDiffSummary[];
  readonly comparedColumns: readonly string[];
}

/** Full comparison result */
export interface ComparisonResult {
  readonly summary: ComparisonSummary;
  readonly cellDiffs: readonly CellDiff[];
}

/** Validation result for uploaded files */
export interface ValidationResult {
  readonly valid: boolean;
  readonly error: string | null;
}

/** API response wrapper */
export interface ApiResponse<T> {
  readonly success: boolean;
  readonly data: T | null;
  readonly error: string | null;
}
