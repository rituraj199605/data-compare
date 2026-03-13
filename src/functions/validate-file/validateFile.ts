/* ---------------------------------------------------------------
 * validateFile: validate uploaded file before parsing.
 * Rule 9: function in own folder.
 * Rule 4: ≤60 lines.  Rule 8: max 4 functions.
 * --------------------------------------------------------------- */

import type { ValidationResult } from "@/types";
import {
  MAX_FILE_SIZE_BYTES,
  SUPPORTED_EXTENSIONS,
} from "@/initializers/init-config/initConfig";

/**
 * Validate an uploaded file by name and size.
 * Returns { valid: true } or { valid: false, error: "…" }.
 */
export function validateFile(
  fileName: string,
  fileSize: number
): ValidationResult {
  if (fileName.length === 0) {
    return { valid: false, error: "File name is empty." };
  }

  const lower: string = fileName.toLowerCase();
  let extOk = false;
  const extLimit: number = SUPPORTED_EXTENSIONS.length;
  for (let i = 0; i < extLimit; i++) {
    const ext: string | undefined = SUPPORTED_EXTENSIONS[i];
    if (ext !== undefined && lower.endsWith(ext)) {
      extOk = true;
      break;
    }
  }
  if (!extOk) {
    return {
      valid: false,
      error: "Unsupported file type. Use .csv or .xlsx.",
    };
  }

  if (fileSize <= 0) {
    return { valid: false, error: "File is empty." };
  }
  if (fileSize > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File exceeds maximum size of ${MAX_FILE_SIZE_BYTES / (1024 * 1024)} MB.`,
    };
  }

  return { valid: true, error: null };
}
