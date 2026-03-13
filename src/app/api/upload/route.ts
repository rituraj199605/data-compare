/* ---------------------------------------------------------------
 * /api/upload — handle file uploads, parse, return metadata.
 * Rule 8: max 4 functions in this file.
 * Rule 5: every return value checked.
 * --------------------------------------------------------------- */

import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse, ParsedFileMeta } from "@/types";
import { validateFile } from "@/functions/validate-file/validateFile";
import { FileParser } from "@/classes/file-parser/FileParser";
import type { ValidationResult } from "@/types";

/** Store parsed data in-memory keyed by session (Rule 3: pre-sized). */
const fileStore = new Map<string, { rows: Record<string, string>[] }>();

export { fileStore };

/** Build a storage key from session + slot. */
function makeStoreKey(sessionId: string, slot: "A" | "B"): string {
  return sessionId + ":" + slot;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<ParsedFileMeta>>> {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { success: false, data: null, error: "Invalid form data." },
      { status: 400 }
    );
  }

  const file: FormDataEntryValue | null = formData.get("file");
  const slot: FormDataEntryValue | null = formData.get("slot");
  const sessionId: FormDataEntryValue | null = formData.get("sessionId");

  if (file === null || !(file instanceof File)) {
    return NextResponse.json(
      { success: false, data: null, error: "No file provided." },
      { status: 400 }
    );
  }
  if (slot === null || (String(slot) !== "A" && String(slot) !== "B")) {
    return NextResponse.json(
      { success: false, data: null, error: "Invalid slot (must be A or B)." },
      { status: 400 }
    );
  }

  const validation: ValidationResult = validateFile(file.name, file.size);
  if (!validation.valid) {
    return NextResponse.json(
      { success: false, data: null, error: validation.error },
      { status: 400 }
    );
  }

  const arrayBuffer: ArrayBuffer = await file.arrayBuffer();
  const buffer: Buffer = Buffer.from(arrayBuffer);
  const parser = new FileParser();
  const parsed = await parser.parse(buffer, file.name);

  if (parsed === null) {
    return NextResponse.json(
      { success: false, data: null, error: "Failed to parse file." },
      { status: 422 }
    );
  }

  const key: string = makeStoreKey(String(sessionId ?? "default"), String(slot) as "A" | "B");
  fileStore.set(key, { rows: parsed.rows as Record<string, string>[] });

  return NextResponse.json({
    success: true,
    data: parsed.meta,
    error: null,
  });
}
