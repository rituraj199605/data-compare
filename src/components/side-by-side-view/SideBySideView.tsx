/* ---------------------------------------------------------------
 * SideBySideView: side-by-side table with diff highlighting.
 * Uses simple pagination for performance (no virtual scroll lib).
 * Rule 8: max 4 functions.  Rule 2: bounded loops.
 * --------------------------------------------------------------- */

"use client";

import { useState } from "react";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import type { CellDiff, RowRecord, ParsedFileMeta } from "@/types";
import { ChevronLeft, ChevronRight, TableIcon } from "lucide-react";

interface SideBySideViewProps {
  metaA: ParsedFileMeta;
  rowsA: readonly RowRecord[];
  rowsB: readonly RowRecord[];
  diffs: readonly CellDiff[];
}

const ROWS_PER_PAGE = 100;

/** Get a diff kind for a specific cell. */
function getDiffKind(
  diffs: readonly CellDiff[], rowIdx: number, col: string
): string | null {
  const limit: number = diffs.length;
  for (let i = 0; i < limit; i++) {
    const d: CellDiff | undefined = diffs[i];
    if (d === undefined) { continue; }
    if (d.rowIndex === rowIdx && d.columnName === col) { return d.kind; }
  }
  return null;
}

export function SideBySideView({
  metaA, rowsA, rowsB, diffs,
}: SideBySideViewProps): JSX.Element {
  const [page, setPage] = useState<number>(0);
  const maxRows: number = Math.max(rowsA.length, rowsB.length);
  const totalPages: number = Math.max(Math.ceil(maxRows / ROWS_PER_PAGE), 1);
  const start: number = page * ROWS_PER_PAGE;
  const end: number = Math.min(start + ROWS_PER_PAGE, maxRows);
  const columns: readonly string[] = metaA.columnNames;
  const cLen: number = columns.length;

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          <TableIcon className="w-4 h-4" /> Side-by-Side View
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-xs text-muted-foreground">{page + 1}/{totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="overflow-auto max-h-[600px]">
        <table className="w-full text-xs border-collapse">
          <thead className="sticky top-0 z-10 bg-background">
            <tr>
              <th className="p-1.5 border font-medium text-muted-foreground">#</th>
              {(() => {
                const hs: JSX.Element[] = [];
                for (let c = 0; c < cLen; c++) {
                  const col: string | undefined = columns[c];
                  if (col === undefined) { continue; }
                  hs.push(
                    <th key={`a-${col}`} className="p-1.5 border font-medium bg-blue-50/50 dark:bg-blue-950/20">A: {col}</th>,
                    <th key={`b-${col}`} className="p-1.5 border font-medium bg-orange-50/50 dark:bg-orange-950/20">B: {col}</th>
                  );
                }
                return hs;
              })()}
            </tr>
          </thead>
          <tbody>
            {(() => {
              const trs: JSX.Element[] = [];
              for (let r = start; r < end; r++) {
                const rA: RowRecord | undefined = rowsA[r];
                const rB: RowRecord | undefined = rowsB[r];
                const cells: JSX.Element[] = [];
                for (let c = 0; c < cLen; c++) {
                  const col: string | undefined = columns[c];
                  if (col === undefined) { continue; }
                  const vA: string = rA !== undefined ? (rA[col] ?? "") : "";
                  const vB: string = rB !== undefined ? (rB[col] ?? "") : "";
                  const dk: string | null = getDiffKind(diffs, r, col);
                  const hl: string = dk === "mismatch" ? "bg-red-100 dark:bg-red-900/30" : dk === "type_diff" ? "bg-blue-100 dark:bg-blue-900/30" : dk !== null ? "bg-amber-100 dark:bg-amber-900/30" : "";
                  cells.push(
                    <td key={`a-${col}-${r}`} className={`p-1.5 border max-w-[150px] truncate ${hl}`}>{vA || "—"}</td>,
                    <td key={`b-${col}-${r}`} className={`p-1.5 border max-w-[150px] truncate ${hl}`}>{vB || "—"}</td>
                  );
                }
                trs.push(<tr key={r}><td className="p-1.5 border text-muted-foreground font-mono">{r}</td>{cells}</tr>);
              }
              return trs;
            })()}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
