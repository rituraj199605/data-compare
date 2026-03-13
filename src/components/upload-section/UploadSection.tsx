/* ---------------------------------------------------------------
 * UploadSection: the file upload area of the dashboard.
 * Rule 8: max 4 functions.  Rule 4: ≤60 lines.
 * --------------------------------------------------------------- */

"use client";

import { FileUpload } from "@/components/file-upload/FileUpload";
import type { ParsedFileMeta } from "@/types";

interface UploadSectionProps {
  sessionId: string;
  onUploadA: (meta: ParsedFileMeta) => void;
  onUploadB: (meta: ParsedFileMeta) => void;
  metaA: ParsedFileMeta | null;
  metaB: ParsedFileMeta | null;
}

export function UploadSection({
  sessionId, onUploadA, onUploadB,
}: UploadSectionProps): JSX.Element {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FileUpload slot="A" sessionId={sessionId} onUploaded={onUploadA} />
      <FileUpload slot="B" sessionId={sessionId} onUploaded={onUploadB} />
    </div>
  );
}
