"use client";

import { useRouter } from "next/navigation";
import { FileText, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadZone } from "@/components/upload/UploadZone";
import { FileList } from "@/components/upload/FileList";
import { useUploadStore } from "@/lib/upload-store";

export default function Home() {
  const router = useRouter();
  const { state, startProcessing } = useUploadStore();
  const hasFiles = state.files.length > 0;
  const isProcessing = state.processingStage !== "idle";

  async function handleStart() {
    // Navigate first so the user sees the processing screen
    router.push("/processing");
    // Kick off the pipeline (the processing page will observe state changes)
    await startProcessing();
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl flex-col items-center justify-center px-6 py-16">
      {/* Hero */}
      <div className="mb-10 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[var(--primary)]">
          <FileText className="h-8 w-8" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
          Patientenakte intelligent zusammenfassen
        </h1>

        <p className="mx-auto mt-3 max-w-lg text-base text-[var(--muted-foreground)]">
          Laden Sie medizinische Dokumente hoch und erhalten Sie in wenigen
          Sekunden eine strukturierte, übersichtliche Patientenzusammenfassung
          mit Diagnosen, Laborwerten und Zeitverlauf.
        </p>
      </div>

      {/* Upload area */}
      <div className="w-full space-y-4">
        <UploadZone />
        <FileList />
      </div>

      {/* CTA */}
      {hasFiles && (
        <Button
          size="lg"
          className="mt-6 gap-2 px-8"
          disabled={isProcessing}
          onClick={handleStart}
        >
          Verarbeitung starten
          <ArrowRight className="h-4 w-4" />
        </Button>
      )}

      {/* Trust signals */}
      <div className="mt-12 flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
        <ShieldCheck className="h-4 w-4" />
        <span>
          Ihre Dokumente werden verschlüsselt übertragen und nicht gespeichert.
        </span>
      </div>
    </main>
  );
}
