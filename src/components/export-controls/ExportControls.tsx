/* ---------------------------------------------------------------
 * ExportControls: buttons to export diff report.
 * Rule 8: max 4 functions.
 * --------------------------------------------------------------- */

"use client";

import { useState } from "react";
import { Button } from "@/ui/button";
import type { ComparisonResult } from "@/types";
import { FileSpreadsheet, FileText } from "lucide-react";

interface ExportControlsProps {
  result: ComparisonResult;
}

async function triggerDownload(
  result: ComparisonResult,
  format: "csv" | "xlsx",
  setLoading: (v: boolean) => void
): Promise<void> {
  setLoading(true);
  let resp: Response;
  try {
    resp = await fetch("/api/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ format, result }),
    });
  } catch {
    setLoading(false);
    return;
  }
  if (!resp.ok) {
    setLoading(false);
    return;
  }
  const blob: Blob = await resp.blob();
  const url: string = URL.createObjectURL(blob);
  const ext: string = format === "csv" ? "csv" : "xlsx";
  const a: HTMLAnchorElement = document.createElement("a");
  a.href = url;
  a.download = `diff-report.${ext}`;
  a.click();
  URL.revokeObjectURL(url);
  setLoading(false);
}

export function ExportControls({ result }: ExportControlsProps): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" disabled={loading}
        onClick={() => void triggerDownload(result, "csv", setLoading)}
        className="gap-2">
        <FileText className="w-4 h-4" /> Export CSV
      </Button>
      <Button variant="outline" size="sm" disabled={loading}
        onClick={() => void triggerDownload(result, "xlsx", setLoading)}
        className="gap-2">
        <FileSpreadsheet className="w-4 h-4" /> Export Excel
      </Button>
      {loading && <span className="text-xs text-muted-foreground">Generating...</span>}
    </div>
  );
}
