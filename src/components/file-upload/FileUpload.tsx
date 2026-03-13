/* ---------------------------------------------------------------
 * FileUpload: drag-and-drop upload for CSV/XLSX.
 * Rule 8: max 4 functions in this file.
 * --------------------------------------------------------------- */

"use client";

import { useState, type DragEvent, type ChangeEvent } from "react";
import { Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/ui/card";
import type { ParsedFileMeta, ApiResponse } from "@/types";

interface FileUploadProps {
  slot: "A" | "B";
  sessionId: string;
  onUploaded: (meta: ParsedFileMeta) => void;
}

export function FileUpload({ slot, sessionId, onUploaded }: FileUploadProps): JSX.Element {
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [message, setMessage] = useState<string>("");
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");

  async function handleFile(file: File): Promise<void> {
    setStatus("uploading");
    setFileName(file.name);
    setMessage("Parsing...");
    const form = new FormData();
    form.append("file", file);
    form.append("slot", slot);
    form.append("sessionId", sessionId);
    let resp: Response;
    try {
      resp = await fetch("/api/upload", { method: "POST", body: form });
    } catch {
      setStatus("error");
      setMessage("Network error.");
      return;
    }
    const json: ApiResponse<ParsedFileMeta> = await resp.json();
    if (!json.success || json.data === null) {
      setStatus("error");
      setMessage(json.error ?? "Upload failed.");
      return;
    }
    setStatus("done");
    setMessage(`${json.data.totalRows} rows, ${json.data.columnNames.length} columns`);
    onUploaded(json.data);
  }

  function onDrop(e: DragEvent<HTMLDivElement>): void {
    e.preventDefault();
    setDragOver(false);
    const f: File | undefined = e.dataTransfer.files[0];
    if (f !== undefined) { void handleFile(f); }
  }

  function onChange(e: ChangeEvent<HTMLInputElement>): void {
    const f: File | undefined = e.target.files?.[0];
    if (f !== undefined) { void handleFile(f); }
  }

  return (
    <Card
      className={`relative transition-all duration-200 ${dragOver ? "ring-2 ring-primary border-primary" : ""} ${status === "done" ? "border-green-500/50 bg-green-50/30 dark:bg-green-950/10" : ""} ${status === "error" ? "border-red-500/50" : ""}`}
      onDragOver={(e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
    >
      <CardContent className="p-6">
        <label className="flex flex-col items-center gap-3 cursor-pointer">
          <div className={`p-3 rounded-full ${status === "done" ? "bg-green-100 dark:bg-green-900" : status === "error" ? "bg-red-100 dark:bg-red-900" : "bg-muted"}`}>
            {status === "done" ? <CheckCircle2 className="w-6 h-6 text-green-600" /> : status === "error" ? <AlertCircle className="w-6 h-6 text-red-600" /> : <Upload className="w-6 h-6 text-muted-foreground" />}
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">
              File {slot} {fileName.length > 0 ? `— ${fileName}` : ""}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {status === "idle" && "Drop CSV or XLSX here, or click to browse"}
              {status === "uploading" && message}
              {status === "done" && message}
              {status === "error" && message}
            </p>
          </div>
          <input type="file" accept=".csv,.xlsx" className="hidden" onChange={onChange} />
        </label>
      </CardContent>
    </Card>
  );
}
