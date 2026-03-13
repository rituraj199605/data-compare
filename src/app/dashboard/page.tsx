/* ---------------------------------------------------------------
 * Dashboard page: main comparison interface.
 * Rule 4: ≤60 lines — logic split into useComparisonState hook.
 * Rule 8: max 4 functions.
 * --------------------------------------------------------------- */

"use client";

import { useComparisonState } from "@/lib/useComparisonState";
import { UploadSection } from "@/components/upload-section/UploadSection";
import { ComparisonOptions } from "@/components/comparison-options/ComparisonOptions";
import { ResultsSection } from "@/components/results-section/ResultsSection";
import { Button } from "@/ui/button";
import { Card, CardContent } from "@/ui/card";
import { AlertCircle, PlayCircle } from "lucide-react";

export default function DashboardPage(): JSX.Element {
  const [state, actions] = useComparisonState();
  const bothUploaded: boolean = state.metaA !== null && state.metaB !== null;
  const canCompare: boolean =
    bothUploaded &&
    (state.matchMode === "positional" || state.keyColumns.length > 0);
  const cols: readonly string[] = state.metaA?.columnNames ?? [];

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-6 space-y-6">
      <UploadSection
        sessionId={state.sessionId}
        onUploadA={actions.setMetaA}
        onUploadB={actions.setMetaB}
        metaA={state.metaA}
        metaB={state.metaB}
      />

      {bothUploaded && (
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          <Card>
            <CardContent className="p-5">
              <ComparisonOptions
                matchMode={state.matchMode}
                onMatchModeChange={actions.setMatchMode}
                keyColumns={state.keyColumns}
                onToggleKeyColumn={actions.toggleKeyColumn}
                availableColumns={cols}
                caseSensitive={state.caseSensitive}
                onCaseSensitiveChange={actions.setCaseSensitive}
                whitespaceSensitive={state.whitespaceSensitive}
                onWhitespaceSensitiveChange={actions.setWhitespaceSensitive}
                numericTolerance={state.numericTolerance}
                onNumericToleranceChange={actions.setNumericTolerance}
              />
              <Button className="w-full mt-5 gap-2" disabled={!canCompare || state.comparing} onClick={() => void actions.runComparison()}>
                <PlayCircle className="w-4 h-4" />
                {state.comparing ? "Comparing..." : "Run Comparison"}
              </Button>
              {state.error.length > 0 && (
                <div className="flex items-center gap-2 mt-3 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {state.error}
                </div>
              )}
            </CardContent>
          </Card>

          <div>
            {state.result !== null && (
              <ResultsSection
                result={state.result}
                selectedColumn={state.selectedColumn}
                onColumnClick={(col) => actions.setSelectedColumn(col)}
                onCloseModal={() => actions.setSelectedColumn(null)}
                getColumnDiffs={actions.getColumnDiffs}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
