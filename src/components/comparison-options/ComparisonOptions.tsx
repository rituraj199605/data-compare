/* ---------------------------------------------------------------
 * ComparisonOptions: configure how comparison runs.
 * Rule 8: max 4 functions.
 * --------------------------------------------------------------- */

"use client";

import { Switch } from "@/ui/switch";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Button } from "@/ui/button";
import { ColumnSelector } from "@/components/column-selector/ColumnSelector";
import type { MatchMode } from "@/types";
import { Settings2, Columns3, ArrowDownUp } from "lucide-react";

interface ComparisonOptionsProps {
  matchMode: MatchMode;
  onMatchModeChange: (mode: MatchMode) => void;
  keyColumns: string[];
  onToggleKeyColumn: (col: string) => void;
  availableColumns: readonly string[];
  caseSensitive: boolean;
  onCaseSensitiveChange: (val: boolean) => void;
  whitespaceSensitive: boolean;
  onWhitespaceSensitiveChange: (val: boolean) => void;
  numericTolerance: number;
  onNumericToleranceChange: (val: number) => void;
}

export function ComparisonOptions(props: ComparisonOptionsProps): JSX.Element {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Settings2 className="w-4 h-4" />
        Comparison Settings
      </div>

      <div className="space-y-3">
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">Match Mode</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button variant={props.matchMode === "key" ? "default" : "outline"} size="sm" onClick={() => props.onMatchModeChange("key")} className="gap-2">
            <Columns3 className="w-3.5 h-3.5" /> Key Column(s)
          </Button>
          <Button variant={props.matchMode === "positional" ? "default" : "outline"} size="sm" onClick={() => props.onMatchModeChange("positional")} className="gap-2">
            <ArrowDownUp className="w-3.5 h-3.5" /> Positional
          </Button>
        </div>
      </div>

      {props.matchMode === "key" && (
        <ColumnSelector columns={props.availableColumns} selected={props.keyColumns} onToggle={props.onToggleKeyColumn} label="Key Columns" />
      )}

      <div className="space-y-3 pt-2 border-t">
        <div className="flex items-center justify-between">
          <Label htmlFor="case" className="text-sm">Case Sensitive</Label>
          <Switch id="case" checked={props.caseSensitive} onCheckedChange={props.onCaseSensitiveChange} />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="ws" className="text-sm">Whitespace Sensitive</Label>
          <Switch id="ws" checked={props.whitespaceSensitive} onCheckedChange={props.onWhitespaceSensitiveChange} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="tol" className="text-sm">Numeric Tolerance</Label>
          <Input id="tol" type="number" min="0" step="0.001" value={props.numericTolerance} onChange={(e) => props.onNumericToleranceChange(Number(e.target.value))} className="h-9" />
        </div>
      </div>
    </div>
  );
}
