/* ---------------------------------------------------------------
 * /api/export — export comparison diffs as CSV or XLSX.
 * Rule 8: max 4 functions.  Rule 5: return values checked.
 * --------------------------------------------------------------- */

import { NextRequest, NextResponse } from "next/server";
import type { ComparisonResult } from "@/types";
import { exportDiffsToCsv } from "@/functions/export-csv/exportCsv";
import { exportDiffsToExcel } from "@/functions/export-excel/exportExcel";

interface ExportBody {
  format: "csv" | "xlsx";
  result: ComparisonResult;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse> {
  let body: ExportBody;
  try {
    body = (await request.json()) as ExportBody;
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const fmt: string = body.format;
  const result: ComparisonResult | undefined = body.result;
  if (result === undefined) {
    return NextResponse.json(
      { success: false, error: "No comparison result provided." },
      { status: 400 }
    );
  }

  if (fmt === "csv") {
    const buf: Buffer = exportDiffsToCsv(result.summary, result.cellDiffs);
    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=diff-report.csv",
      },
    });
  }

  if (fmt === "xlsx") {
    const buf: Buffer = exportDiffsToExcel(result.summary, result.cellDiffs);
    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=diff-report.xlsx",
      },
    });
  }

  return NextResponse.json(
    { success: false, error: "Invalid format. Use csv or xlsx." },
    { status: 400 }
  );
}
