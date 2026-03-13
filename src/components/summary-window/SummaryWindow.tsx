/* ---------------------------------------------------------------
 * SummaryWindow: display comparison summary with clickable columns.
 * Rule 8: max 4 functions.
 * --------------------------------------------------------------- */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Badge } from "@/ui/badge";
import type { ComparisonSummary, ColumnDiffSummary } from "@/types";
import { BarChart3, FileCheck, FileX, FileMinus2 } from "lucide-react";

interface SummaryWindowProps {
  summary: ComparisonSummary;
  onColumnClick: (columnName: string) => void;
}

function StatCard({ icon, label, value, color }: {
  icon: JSX.Element; label: string; value: number; color: string;
}): JSX.Element {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border ${color}`}>
      {icon}
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-bold">{value.toLocaleString()}</p>
      </div>
    </div>
  );
}

export function SummaryWindow({ summary, onColumnClick }: SummaryWindowProps): JSX.Element {
  const colSummaries: readonly ColumnDiffSummary[] = summary.columnSummaries;
  const colLimit: number = colSummaries.length;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard icon={<FileCheck className="w-5 h-5 text-green-600" />} label="Matched Rows" value={summary.matchedRows} color="bg-green-50/50 dark:bg-green-950/20" />
            <StatCard icon={<FileX className="w-5 h-5 text-red-600" />} label="Mismatched Rows" value={summary.mismatchedRows} color="bg-red-50/50 dark:bg-red-950/20" />
            <StatCard icon={<FileMinus2 className="w-5 h-5 text-amber-600" />} label="Only in File A" value={summary.rowsOnlyInA} color="bg-amber-50/50 dark:bg-amber-950/20" />
            <StatCard icon={<FileMinus2 className="w-5 h-5 text-blue-600" />} label="Only in File B" value={summary.rowsOnlyInB} color="bg-blue-50/50 dark:bg-blue-950/20" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Per-Column Differences</CardTitle>
        </CardHeader>
        <CardContent>
          {colLimit === 0 ? (
            <p className="text-sm text-muted-foreground">No differences found.</p>
          ) : (
            <div className="space-y-1.5">
              {(() => {
                const items: JSX.Element[] = [];
                for (let i = 0; i < colLimit; i++) {
                  const cs: ColumnDiffSummary | undefined = colSummaries[i];
                  if (cs === undefined) { continue; }
                  items.push(
                    <button key={cs.columnName} type="button" onClick={() => onColumnClick(cs.columnName)}
                      className="w-full flex items-center justify-between p-3 rounded-lg border bg-background hover:bg-accent/50 transition-colors text-left group">
                      <span className="text-sm font-medium group-hover:text-primary transition-colors">{cs.columnName}</span>
                      <div className="flex items-center gap-2">
                        {cs.mismatchCount > 0 && <Badge variant="mismatch">{cs.mismatchCount} mismatch</Badge>}
                        {cs.typeDiffCount > 0 && <Badge variant="typediff">{cs.typeDiffCount} type</Badge>}
                        {cs.missingACount > 0 && <Badge variant="missing">{cs.missingACount} only B</Badge>}
                        {cs.missingBCount > 0 && <Badge variant="missing">{cs.missingBCount} only A</Badge>}
                      </div>
                    </button>
                  );
                }
                return items;
              })()}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
