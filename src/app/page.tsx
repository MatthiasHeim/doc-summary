"use client";

import { useRouter } from "next/navigation";
import { FileText, ArrowRight, ShieldCheck, Lock } from "lucide-react";
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
      <div className="mb-10 text-center animate-slide-up">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--accent)] text-[var(--primary)] shadow-sm">
          <FileText className="h-8 w-8" />
        </div>

        <h1 className="text-[2rem] font-bold leading-tight tracking-tight text-[var(--foreground)]">
          Patientenakte intelligent zusammenfassen
        </h1>

        <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-[var(--muted-foreground)]">
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
        <div className="mt-8 animate-fade-in">
          <Button
            size="lg"
            className="gap-2.5 rounded-lg px-10 py-3 text-[15px] font-semibold shadow-md shadow-[var(--primary)]/10 transition-all hover:shadow-lg hover:shadow-[var(--primary)]/15"
            disabled={isProcessing}
            onClick={handleStart}
          >
            Verarbeitung starten
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Trust signals */}
      <div className="mt-14 flex items-center gap-6 text-xs text-[var(--muted-foreground)]">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4" />
          <span>Verschlüsselte Übertragung</span>
        </div>
        <div className="h-3 w-px bg-[var(--border)]" />
        <div className="flex items-center gap-1.5">
          <Lock className="h-3.5 w-3.5" />
          <span>Keine Datenspeicherung</span>
        </div>
      </div>
    </main>
  );
}
