/* ---------------------------------------------------------------
 * ComparisonEngine: orchestrates comparison of two parsed files.
 * Rule 10: class in own folder. Rule 8: 1 class.
 * Rule 1: no recursion. Rule 4: ≤60 lines/method.
 * Rule 3: uses pre-allocated buffers from initBuffers.
 * --------------------------------------------------------------- */

import type {
  ParsedFile,
  ComparisonOptions,
  ComparisonResult,
  CellDiff,
  ComparisonSummary,
} from "@/types";
import { matchByKey } from "@/functions/match-by-key/matchByKey";
import { matchByPosition } from "@/functions/match-by-position/matchByPosition";
import { detectMissingRows } from "@/functions/detect-missing-rows/detectMissingRows";
import { buildSummary } from "@/functions/build-summary/buildSummary";
import { resetBuffers } from "@/initializers/init-buffers/initBuffers";

export class ComparisonEngine {
  /**
   * Run a full comparison between fileA and fileB.
   * Returns null if inputs are invalid.
   */
  compare(
    fileA: ParsedFile,
    fileB: ParsedFile,
    options: ComparisonOptions
  ): ComparisonResult | null {
    if (fileA.rows.length === 0 || fileB.rows.length === 0) {
      return null;
    }
    /* Rule 3: reset pre-allocated buffers before use */
    resetBuffers();

    let matchedDiffs: CellDiff[];
    if (options.matchMode === "key") {
      const keyResult = matchByKey(fileA, fileB, options);
      if (keyResult === null) {
        return null;
      }
      matchedDiffs = keyResult;
    } else {
      const posResult = matchByPosition(fileA, fileB, options);
      if (posResult === null) {
        return null;
      }
      matchedDiffs = posResult;
    }

    const missingDiffs: CellDiff[] = detectMissingRows(
      fileA, fileB, options
    );

    const allDiffs: CellDiff[] = matchedDiffs.concat(missingDiffs);

    const summary: ComparisonSummary = buildSummary(
      fileA, fileB, allDiffs, options
    );

    const result: ComparisonResult = {
      summary,
      cellDiffs: allDiffs,
    };
    return result;
  }
}
