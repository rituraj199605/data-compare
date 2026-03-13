/* ---------------------------------------------------------------
 * /api/compare — run comparison on two uploaded files.
 * Rule 8: max 4 functions.  Rule 5: return values checked.
 * --------------------------------------------------------------- */

import { NextRequest, NextResponse } from "next/server";
import type {
  ApiResponse,
  ComparisonResult,
  ComparisonOptions,
  ParsedFile,
  RowRecord,
  MatchMode,
} from "@/types";
import { ComparisonEngine } from "@/classes/comparison-engine/ComparisonEngine";
import { fileStore } from "@/app/api/upload/route";

interface CompareBody {
  sessionId: string;
  matchMode: MatchMode;
  keyColumns: string[];
  caseSensitive: boolean;
  whitespaceSensitive: boolean;
  numericTolerance: number;
  columnsA: string[];
  columnsB: string[];
}

/** Retrieve a parsed file from the store. */
function getFile(
  sessionId: string,
  slot: "A" | "B",
  columns: string[]
): ParsedFile | null {
  const key: string = sessionId + ":" + slot;
  const entry = fileStore.get(key);
  if (entry === undefined) {
    return null;
  }
  const rows: RowRecord[] = entry.rows;
  const file: ParsedFile = {
    meta: {
      fileName: slot,
      format: "csv",
      totalRows: rows.length,
      columnNames: columns,
    },
    rows,
  };
  return file;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<ComparisonResult>>> {
  let body: CompareBody;
  try {
    body = (await request.json()) as CompareBody;
  } catch {
    return NextResponse.json(
      { success: false, data: null, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const sid: string = body.sessionId ?? "default";
  const fileA: ParsedFile | null = getFile(sid, "A", body.columnsA);
  const fileB: ParsedFile | null = getFile(sid, "B", body.columnsB);

  if (fileA === null) {
    return NextResponse.json(
      { success: false, data: null, error: "File A not uploaded." },
      { status: 400 }
    );
  }
  if (fileB === null) {
    return NextResponse.json(
      { success: false, data: null, error: "File B not uploaded." },
      { status: 400 }
    );
  }

  const options: ComparisonOptions = {
    matchMode: body.matchMode,
    keyColumns: body.keyColumns,
    caseSensitive: body.caseSensitive,
    whitespaceSensitive: body.whitespaceSensitive,
    numericTolerance: body.numericTolerance,
  };

  const engine = new ComparisonEngine();
  const result: ComparisonResult | null = engine.compare(
    fileA, fileB, options
  );

  if (result === null) {
    return NextResponse.json(
      { success: false, data: null, error: "Comparison failed." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    data: result,
    error: null,
  });
}
