"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUploadStore, type ProcessingStage } from "@/lib/upload-store";
import { FileList } from "@/components/upload/FileList";

// ---------------------------------------------------------------------------
// Stage metadata
// ---------------------------------------------------------------------------

interface StageInfo {
  label: string;
  description: string;
  progress: number;
}

const STAGE_MAP: Record<ProcessingStage, StageInfo> = {
  idle: { label: "Vorbereitung", description: "Dateien werden vorbereitet...", progress: 0 },
  extracting: {
    label: "Extraktion",
    description: "Texte werden aus den Dokumenten extrahiert...",
    progress: 35,
  },
  analyzing: {
    label: "Analyse",
    description: "Dokumente werden mit KI analysiert...",
    progress: 70,
  },
  complete: {
    label: "Fertig",
    description: "Ihre Patientenübersicht ist bereit.",
    progress: 100,
  },
  error: { label: "Fehler", description: "Ein Fehler ist aufgetreten.", progress: 0 },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ProcessingPage() {
  const router = useRouter();
  const { state, reset } = useUploadStore();
  const { processingStage, files, errorMessage } = state;

  // Redirect to home if no files
  useEffect(() => {
    if (files.length === 0 && processingStage === "idle") {
      router.replace("/");
    }
  }, [files.length, processingStage, router]);

  // Auto-navigate to summary on completion
  useEffect(() => {
    if (processingStage === "complete") {
      const timer = setTimeout(() => {
        router.push("/summary");
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [processingStage, router]);

  const stage = STAGE_MAP[processingStage];
  const isError = processingStage === "error";

  function handleRetry() {
    reset();
    router.replace("/");
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl flex-col items-center justify-center px-6 py-16">
      <Card className="w-full shadow-md">
        <CardContent className="space-y-8 p-8">
          {/* Header */}
          <div className="flex flex-col items-center gap-4 text-center">
            {isError ? (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-[var(--destructive)]">
                <AlertCircle className="h-7 w-7" />
              </div>
            ) : processingStage === "complete" ? (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 animate-fade-in">
                <CheckCircle className="h-7 w-7" />
              </div>
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--primary)]">
                <Loader2 className="h-7 w-7 animate-spin" />
              </div>
            )}

            <div>
              <h1 className="text-xl font-semibold text-[var(--foreground)]">
                {stage.label}
              </h1>
              <p className="mt-1.5 text-sm text-[var(--muted-foreground)]">
                {stage.description}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          {!isError && (
            <div className="space-y-2">
              <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-[var(--secondary)]">
                <div
                  className="h-full rounded-full bg-[var(--primary)] transition-all duration-700 ease-out"
                  style={{ width: `${stage.progress}%` }}
                />
                {processingStage !== "complete" && (
                  <div className="absolute inset-0 overflow-hidden rounded-full">
                    <div
                      className="h-full w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                      style={{ animation: "progress-shimmer 2s ease-in-out infinite" }}
                    />
                  </div>
                )}
              </div>
              <p className="text-right text-xs tabular-nums text-[var(--muted-foreground)]">
                {stage.progress}%
              </p>
            </div>
          )}

          {/* Error message */}
          {isError && errorMessage && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-[var(--destructive)]">
              {errorMessage}
            </div>
          )}

          {/* Steps indicator */}
          {!isError && (
            <div className="space-y-0">
              <StepRow
                label="Texte extrahieren"
                description="OCR und Textextraktion"
                active={processingStage === "extracting"}
                done={
                  processingStage === "analyzing" ||
                  processingStage === "complete"
                }
                isFirst
              />
              <StepRow
                label="Dokumente analysieren"
                description="KI-gestützte Inhaltsanalyse"
                active={processingStage === "analyzing"}
                done={processingStage === "complete"}
              />
              <StepRow
                label="Übersicht erstellen"
                description="Strukturierte Zusammenfassung"
                active={false}
                done={processingStage === "complete"}
                isLast
              />
            </div>
          )}

          {/* Per-file status */}
          <div>
            <p className="mb-3 text-sm font-medium text-[var(--foreground)]">
              Dateien ({files.length})
            </p>
            <FileList readonly />
          </div>

          {/* Error actions */}
          {isError && (
            <div className="flex justify-center">
              <Button variant="outline" onClick={handleRetry}>
                Zurück zur Startseite
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Step row sub-component
// ---------------------------------------------------------------------------

function StepRow({
  label,
  description,
  active,
  done,
  isFirst,
  isLast,
}: {
  label: string;
  description: string;
  active: boolean;
  done: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  return (
    <div className="flex items-start gap-3.5 relative">
      {/* Vertical connecting line */}
      {!isLast && (
        <div className="absolute left-[11px] top-[28px] bottom-0 w-px bg-[var(--border)]" />
      )}

      {/* Status icon */}
      <div className="relative z-10 mt-0.5">
        {done ? (
          <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-emerald-500 text-white">
            <CheckCircle className="h-3.5 w-3.5" />
          </div>
        ) : active ? (
          <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[var(--primary)] text-white">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          </div>
        ) : (
          <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 border-[var(--border)] bg-white" />
        )}
      </div>

      {/* Text */}
      <div className={`pb-5 ${isLast ? "pb-0" : ""}`}>
        <span
          className={
            done
              ? "text-sm font-medium text-emerald-700"
              : active
                ? "text-sm font-semibold text-[var(--foreground)]"
                : "text-sm text-[var(--muted-foreground)]"
          }
        >
          {label}
        </span>
        <p className={`text-xs mt-0.5 ${done ? "text-emerald-600/70" : active ? "text-[var(--muted-foreground)]" : "text-[var(--border)]"}`}>
          {description}
        </p>
      </div>
    </div>
  );
}
