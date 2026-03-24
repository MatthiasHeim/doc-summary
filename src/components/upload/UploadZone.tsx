"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUploadStore } from "@/lib/upload-store";

const ACCEPT = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/msword": [".doc"],
};

export function UploadZone() {
  const { addFiles, state } = useUploadStore();
  const isProcessing = state.processingStage !== "idle";

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        addFiles(acceptedFiles);
      }
    },
    [addFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPT,
    multiple: true,
    disabled: isProcessing,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed px-8 py-14 transition-all cursor-pointer",
        "bg-white hover:bg-blue-50/40",
        isDragActive
          ? "border-[var(--primary)] bg-blue-50/60 scale-[1.01]"
          : "border-[var(--border)] hover:border-[var(--primary)]/50",
        isProcessing && "pointer-events-none opacity-50"
      )}
    >
      <input {...getInputProps()} />

      <div
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full transition-colors",
          isDragActive
            ? "bg-[var(--primary)] text-white"
            : "bg-blue-50 text-[var(--primary)]"
        )}
      >
        <Upload className="h-6 w-6" />
      </div>

      <div className="text-center">
        <p className="text-base font-medium text-[var(--foreground)]">
          {isDragActive
            ? "Dateien hier ablegen"
            : "Dokumente hierher ziehen"}
        </p>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          oder Dateien auswählen
        </p>
      </div>

      <p className="text-xs text-[var(--muted-foreground)]">
        PDF, DOCX oder DOC
      </p>
    </div>
  );
}
