/* ---------------------------------------------------------------
 * ColumnSelector: pick one or more columns as match keys.
 * Rule 8: max 4 functions.
 * --------------------------------------------------------------- */

"use client";

import { Check } from "lucide-react";

interface ColumnSelectorProps {
  columns: readonly string[];
  selected: string[];
  onToggle: (col: string) => void;
  label: string;
}

export function ColumnSelector({
  columns,
  selected,
  onToggle,
  label,
}: ColumnSelectorProps): JSX.Element {
  const limit: number = columns.length;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 rounded-md border bg-muted/30">
        {(() => {
          const items: JSX.Element[] = [];
          for (let i = 0; i < limit; i++) {
            const col: string | undefined = columns[i];
            if (col === undefined) { continue; }
            const isChecked: boolean = selected.includes(col);
            items.push(
              <button
                key={col}
                type="button"
                onClick={() => onToggle(col)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${isChecked ? "bg-primary text-primary-foreground" : "bg-background border hover:bg-accent"}`}
              >
                {isChecked && <Check className="w-3 h-3" />}
                {col}
              </button>
            );
          }
          return items;
        })()}
      </div>
    </div>
  );
}
