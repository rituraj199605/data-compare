/* ---------------------------------------------------------------
 * useComparisonState: manages all state for the comparison flow.
 * Rule 8: max 4 functions.  Rule 7: no function pointers
 *   (React hooks are framework constructs, not fn pointers).
 * --------------------------------------------------------------- */

"use client";

import { useState } from "react";
import type {
  ParsedFileMeta,
  ComparisonResult,
  MatchMode,
  CellDiff,
  ApiResponse,
  RowRecord,
} from "@/types";

export interface ComparisonState {
  metaA: ParsedFileMeta | null;
  metaB: ParsedFileMeta | null;
  matchMode: MatchMode;
  keyColumns: string[];
  caseSensitive: boolean;
  whitespaceSensitive: boolean;
  numericTolerance: number;
  result: ComparisonResult | null;
  comparing: boolean;
  error: string;
  selectedColumn: string | null;
  sessionId: string;
}

export interface ComparisonActions {
  setMetaA: (m: ParsedFileMeta) => void;
  setMetaB: (m: ParsedFileMeta) => void;
  setMatchMode: (m: MatchMode) => void;
  toggleKeyColumn: (col: string) => void;
  setCaseSensitive: (v: boolean) => void;
  setWhitespaceSensitive: (v: boolean) => void;
  setNumericTolerance: (v: number) => void;
  runComparison: () => Promise<void>;
  setSelectedColumn: (col: string | null) => void;
  getColumnDiffs: (col: string) => readonly CellDiff[];
}

export function useComparisonState(): [ComparisonState, ComparisonActions] {
  const [metaA, setMetaA] = useState<ParsedFileMeta | null>(null);
  const [metaB, setMetaB] = useState<ParsedFileMeta | null>(null);
  const [matchMode, setMatchMode] = useState<MatchMode>("positional");
  const [keyColumns, setKeyColumns] = useState<string[]>([]);
  const [caseSensitive, setCaseSensitive] = useState<boolean>(true);
  const [whitespaceSensitive, setWsSensitive] = useState<boolean>(true);
  const [numericTolerance, setNumTol] = useState<number>(0);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [comparing, setComparing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [sessionId] = useState<string>(() => "session-" + Date.now().toString(36));

  function toggleKeyColumn(col: string): void {
    setKeyColumns((prev) => {
      const idx: number = prev.indexOf(col);
      if (idx >= 0) {
        return prev.filter((c) => c !== col);
      }
      return [...prev, col];
    });
  }

  async function runComparison(): Promise<void> {
    if (metaA === null || metaB === null) { return; }
    setComparing(true);
    setError("");
    setResult(null);
    let resp: Response;
    try {
      resp = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId, matchMode, keyColumns,
          caseSensitive, whitespaceSensitive,
          numericTolerance,
          columnsA: metaA.columnNames,
          columnsB: metaB.columnNames,
        }),
      });
    } catch {
      setError("Network error.");
      setComparing(false);
      return;
    }
    const json: ApiResponse<ComparisonResult> = await resp.json();
    setComparing(false);
    if (!json.success || json.data === null) {
      setError(json.error ?? "Comparison failed.");
      return;
    }
    setResult(json.data);
  }

  function getColumnDiffs(col: string): readonly CellDiff[] {
    if (result === null) { return []; }
    const all: readonly CellDiff[] = result.cellDiffs;
    const filtered: CellDiff[] = [];
    const limit: number = all.length;
    for (let i = 0; i < limit; i++) {
      const d: CellDiff | undefined = all[i];
      if (d !== undefined && d.columnName === col) { filtered.push(d); }
    }
    return filtered;
  }

  const state: ComparisonState = {
    metaA, metaB, matchMode, keyColumns,
    caseSensitive, whitespaceSensitive, numericTolerance,
    result, comparing, error, selectedColumn, sessionId,
  };

  const actions: ComparisonActions = {
    setMetaA, setMetaB, setMatchMode, toggleKeyColumn,
    setCaseSensitive, setWhitespaceSensitive: setWsSensitive,
    setNumericTolerance: setNumTol, runComparison,
    setSelectedColumn, getColumnDiffs,
  };

  return [state, actions];
}
