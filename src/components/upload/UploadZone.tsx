"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileUp } from "lucide-react";
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
        "relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed px-8 py-16 transition-all duration-200 cursor-pointer",
        "bg-white hover:bg-[var(--accent)]/30",
        isDragActive
          ? "border-[var(--primary-light)] bg-[var(--accent)] scale-[1.015] shadow-lg shadow-[var(--primary)]/5"
          : "border-[var(--border)] hover:border-[var(--primary-light)]/40",
        isProcessing && "pointer-events-none opacity-50"
      )}
    >
      <input {...getInputProps()} />

      <div
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full transition-all duration-200",
          isDragActive
            ? "bg-[var(--primary)] text-white scale-110"
            : "bg-[var(--accent)] text-[var(--primary)]"
        )}
      >
        {isDragActive ? (
          <FileUp className="h-6 w-6" />
        ) : (
          <Upload className="h-6 w-6" />
        )}
      </div>

      <div className="text-center">
        <p className="text-[15px] font-medium text-[var(--foreground)]">
          {isDragActive
            ? "Dateien hier ablegen"
            : "Dokumente hierher ziehen"}
        </p>
        <p className="mt-1.5 text-sm text-[var(--muted-foreground)]">
          oder{" "}
          <span className="font-medium text-[var(--primary-light)] underline underline-offset-2">
            Dateien auswählen
          </span>
        </p>
      </div>

      <div className="flex items-center gap-3 mt-1">
        <span className="inline-flex items-center rounded-md bg-[var(--secondary)] px-2 py-0.5 text-[11px] font-medium text-[var(--muted-foreground)]">
          PDF
        </span>
        <span className="inline-flex items-center rounded-md bg-[var(--secondary)] px-2 py-0.5 text-[11px] font-medium text-[var(--muted-foreground)]">
          DOCX
        </span>
        <span className="inline-flex items-center rounded-md bg-[var(--secondary)] px-2 py-0.5 text-[11px] font-medium text-[var(--muted-foreground)]">
          DOC
        </span>
      </div>
    </div>
  );
}
