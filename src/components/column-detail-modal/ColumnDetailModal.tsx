/* ---------------------------------------------------------------
 * ColumnDetailModal: paginated diff view for a single column.
 * Rule 8: max 4 functions.  Rule 2: bounded loops.
 * --------------------------------------------------------------- */

"use client";

import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription,
} from "@/ui/dialog";
import { Button } from "@/ui/button";
import { Badge } from "@/ui/badge";
import type { CellDiff, DiffKind } from "@/types";
import { PAGE_SIZE } from "@/initializers/init-config/initConfig";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ColumnDetailModalProps {
  columnName: string;
  diffs: readonly CellDiff[];
  open: boolean;
  onClose: () => void;
}

function kindBadge(kind: DiffKind): JSX.Element {
  if (kind === "mismatch") return <Badge variant="mismatch">Mismatch</Badge>;
  if (kind === "type_diff") return <Badge variant="typediff">Type Diff</Badge>;
  if (kind === "missing_a") return <Badge variant="missing">Only in B</Badge>;
  return <Badge variant="missing">Only in A</Badge>;
}

export function ColumnDetailModal({
  columnName, diffs, open, onClose,
}: ColumnDetailModalProps): JSX.Element {
  const [page, setPage] = useState<number>(0);
  const total: number = diffs.length;
  const totalPages: number = Math.max(Math.ceil(total / PAGE_SIZE), 1);
  const start: number = page * PAGE_SIZE;
  const end: number = Math.min(start + PAGE_SIZE, total);

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Column: {columnName}</DialogTitle>
          <DialogDescription>
            {total} difference{total !== 1 ? "s" : ""} found — Page {page + 1} of {totalPages}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-background border-b">
              <tr>
                <th className="text-left p-2 font-medium text-muted-foreground">Row</th>
                <th className="text-left p-2 font-medium text-muted-foreground">File A</th>
                <th className="text-left p-2 font-medium text-muted-foreground">File B</th>
                <th className="text-left p-2 font-medium text-muted-foreground">Kind</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const rows: JSX.Element[] = [];
                for (let i = start; i < end; i++) {
                  const d: CellDiff | undefined = diffs[i];
                  if (d === undefined) { continue; }
                  const bgClass: string =
                    d.kind === "mismatch" ? "bg-red-50/50 dark:bg-red-950/10" :
                    d.kind === "type_diff" ? "bg-blue-50/50 dark:bg-blue-950/10" :
                    "bg-amber-50/50 dark:bg-amber-950/10";
                  rows.push(
                    <tr key={`${d.rowIndex}-${i}`} className={`border-b ${bgClass}`}>
                      <td className="p-2 font-mono text-xs">{d.rowKeyDisplay}</td>
                      <td className="p-2 max-w-[200px] truncate">{d.valueA ?? "—"}</td>
                      <td className="p-2 max-w-[200px] truncate">{d.valueB ?? "—"}</td>
                      <td className="p-2">{kindBadge(d.kind)}</td>
                    </tr>
                  );
                }
                return rows;
              })()}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
            <ChevronLeft className="w-4 h-4 mr-1" /> Prev
          </Button>
          <span className="text-xs text-muted-foreground">
            {start + 1}–{end} of {total}
          </span>
          <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
