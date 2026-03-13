/* ---------------------------------------------------------------
 * ResultsSection: displays results after comparison.
 * Rule 8: max 4 functions.  Rule 4: ≤60 lines.
 * --------------------------------------------------------------- */

"use client";

import { SummaryWindow } from "@/components/summary-window/SummaryWindow";
import { ColumnDetailModal } from "@/components/column-detail-modal/ColumnDetailModal";
import { ExportControls } from "@/components/export-controls/ExportControls";
import type { ComparisonResult, CellDiff } from "@/types";

interface ResultsSectionProps {
  result: ComparisonResult;
  selectedColumn: string | null;
  onColumnClick: (col: string) => void;
  onCloseModal: () => void;
  getColumnDiffs: (col: string) => readonly CellDiff[];
}

export function ResultsSection({
  result,
  selectedColumn,
  onColumnClick,
  onCloseModal,
  getColumnDiffs,
}: ResultsSectionProps): JSX.Element {
  const colDiffs: readonly CellDiff[] =
    selectedColumn !== null ? getColumnDiffs(selectedColumn) : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Results</h2>
        <ExportControls result={result} />
      </div>

      <SummaryWindow
        summary={result.summary}
        onColumnClick={onColumnClick}
      />

      {selectedColumn !== null && (
        <ColumnDetailModal
          columnName={selectedColumn}
          diffs={colDiffs}
          open={selectedColumn !== null}
          onClose={onCloseModal}
        />
      )}
    </div>
  );
}
