"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle, AlertCircle, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
    description: "Texte werden extrahiert...",
    progress: 35,
  },
  analyzing: {
    label: "Analyse",
    description: "Dokumente werden analysiert...",
    progress: 70,
  },
  complete: {
    label: "Fertig",
    description: "Übersicht wird erstellt...",
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
      <Card className="w-full">
        <CardContent className="space-y-8 p-8">
          {/* Header */}
          <div className="flex flex-col items-center gap-4 text-center">
            {isError ? (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-[var(--destructive)]">
                <AlertCircle className="h-7 w-7" />
              </div>
            ) : processingStage === "complete" ? (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle className="h-7 w-7" />
              </div>
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-[var(--primary)]">
                <Loader2 className="h-7 w-7 animate-spin" />
              </div>
            )}

            <div>
              <h1 className="text-xl font-semibold text-[var(--foreground)]">
                {stage.label}
              </h1>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                {stage.description}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          {!isError && (
            <div className="space-y-2">
              <Progress value={stage.progress} className="h-2.5" />
              <p className="text-right text-xs text-[var(--muted-foreground)]">
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
            <div className="space-y-3">
              <StepRow
                label="Texte extrahieren"
                active={processingStage === "extracting"}
                done={
                  processingStage === "analyzing" ||
                  processingStage === "complete"
                }
              />
              <StepRow
                label="Dokumente analysieren"
                active={processingStage === "analyzing"}
                done={processingStage === "complete"}
              />
              <StepRow
                label="Übersicht erstellen"
                active={false}
                done={processingStage === "complete"}
              />
            </div>
          )}

          {/* Per-file status */}
          <div>
            <p className="mb-2 text-sm font-medium text-[var(--foreground)]">
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
  active,
  done,
}: {
  label: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      {done ? (
        <CheckCircle className="h-5 w-5 text-emerald-500" />
      ) : active ? (
        <Loader2 className="h-5 w-5 animate-spin text-[var(--primary)]" />
      ) : (
        <div className="h-5 w-5 rounded-full border-2 border-[var(--border)]" />
      )}
      <span
        className={
          done
            ? "text-sm text-emerald-700"
            : active
              ? "text-sm font-medium text-[var(--foreground)]"
              : "text-sm text-[var(--muted-foreground)]"
        }
      >
        {label}
      </span>
    </div>
  );
}
