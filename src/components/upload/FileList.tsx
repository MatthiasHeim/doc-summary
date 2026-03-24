"use client";

import { FileText, File, X, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUploadStore, type FileStatus, type UploadFile } from "@/lib/upload-store";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(name: string) {
  const ext = name.toLowerCase().split(".").pop();
  if (ext === "pdf") {
    return <FileText className="h-5 w-5 text-red-500" />;
  }
  return <File className="h-5 w-5 text-blue-500" />;
}

function statusBadge(status: FileStatus) {
  switch (status) {
    case "pending":
      return <Badge variant="secondary">Bereit</Badge>;
    case "uploading":
      return (
        <Badge variant="outline" className="gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          Hochladen
        </Badge>
      );
    case "extracting":
      return (
        <Badge variant="outline" className="gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          Extrahieren
        </Badge>
      );
    case "extracted":
      return (
        <Badge variant="success" className="gap-1">
          <CheckCircle className="h-3 w-3" />
          Fertig
        </Badge>
      );
    case "error":
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertCircle className="h-3 w-3" />
          Fehler
        </Badge>
      );
  }
}

interface FileListProps {
  /** Hide remove buttons during processing */
  readonly?: boolean;
}

export function FileList({ readonly = false }: FileListProps) {
  const { state, removeFile } = useUploadStore();
  const { files } = state;

  if (files.length === 0) return null;

  return (
    <div className="space-y-2">
      {files.map((f: UploadFile) => (
        <div
          key={f.id}
          className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-white px-4 py-3 transition-colors hover:bg-[var(--secondary)]/30"
        >
          {getFileIcon(f.file.name)}

          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-[var(--foreground)]">
              {f.file.name}
            </p>
            <p className="text-xs text-[var(--muted-foreground)]">
              {formatFileSize(f.file.size)}
            </p>
            {f.errorMessage && (
              <p className="text-xs text-[var(--destructive)] mt-0.5">
                {f.errorMessage}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {statusBadge(f.status)}

            {!readonly && f.status === "pending" && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-[var(--muted-foreground)] hover:text-[var(--destructive)]"
                onClick={() => removeFile(f.id)}
                aria-label={`${f.file.name} entfernen`}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
