/* ---------------------------------------------------------------
 * DiffReport: queryable wrapper around ComparisonResult.
 * Rule 10: class in own folder. Rule 8: 1 class.
 * Rule 1: no recursion.  Rule 2: bounded loops.
 * Rule 4: ≤60 lines/method.
 * --------------------------------------------------------------- */

import type {
  ComparisonResult,
  CellDiff,
  ColumnDiffSummary,
  ComparisonSummary,
} from "@/types";
import { PAGE_SIZE } from "@/initializers/init-config/initConfig";

export class DiffReport {
  private readonly result: ComparisonResult;

  constructor(result: ComparisonResult) {
    this.result = result;
  }

  /** Return the top-level summary. */
  getSummary(): ComparisonSummary {
    return this.result.summary;
  }

  /** Return summary for a single column, or null if not found. */
  getColumnSummary(columnName: string): ColumnDiffSummary | null {
    const summaries = this.result.summary.columnSummaries;
    const limit: number = summaries.length;
    for (let i = 0; i < limit; i++) {
      const entry: ColumnDiffSummary | undefined = summaries[i];
      if (entry !== undefined && entry.columnName === columnName) {
        return entry;
      }
    }
    return null;
  }

  /** Return diffs for a specific column, paginated. */
  getColumnDiffs(columnName: string, page: number): readonly CellDiff[] {
    const all: readonly CellDiff[] = this.result.cellDiffs;
    const filtered: CellDiff[] = [];
    const limit: number = all.length;
    /* Rule 2: bounded — max = total cellDiffs count */
    for (let i = 0; i < limit; i++) {
      const diff: CellDiff | undefined = all[i];
      if (diff !== undefined && diff.columnName === columnName) {
        filtered.push(diff);
      }
    }
    const start: number = page * PAGE_SIZE;
    const end: number = start + PAGE_SIZE;
    return filtered.slice(start, end);
  }

  /** Return total pages for a column's diffs. */
  getColumnPageCount(columnName: string): number {
    let count = 0;
    const limit: number = this.result.cellDiffs.length;
    for (let i = 0; i < limit; i++) {
      const diff: CellDiff | undefined = this.result.cellDiffs[i];
      if (diff !== undefined && diff.columnName === columnName) {
        count++;
      }
    }
    return Math.ceil(count / PAGE_SIZE);
  }

  /** Return all cell diffs (unpaginated). */
  getAllDiffs(): readonly CellDiff[] {
    return this.result.cellDiffs;
  }
}
