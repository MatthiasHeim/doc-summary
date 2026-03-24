"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useSourceSheet } from "@/lib/source-sheet-store";
import { useUploadStore } from "@/lib/upload-store";
import type { MedicalDocument } from "@/types/patient";

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("de-CH", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

const typeLabels: Record<MedicalDocument["type"], string> = {
  lab_report: "Laborbericht",
  specialist_report: "Spezialistenbericht",
  hospital_report: "Spitalbericht",
  gp_report: "Hausarztbericht",
  radiology: "Radiologiebericht",
  other: "Anderes Dokument",
};

export function SourceDetail() {
  const { sourceDocId, closeSource } = useSourceSheet();
  const { state } = useUploadStore();
  const record = state.patientRecord;

  const doc = record?.documents.find((d) => d.id === sourceDocId) ?? null;

  return (
    <Sheet open={!!sourceDocId} onOpenChange={(open) => !open && closeSource()}>
      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{doc?.title ?? "Dokument"}</SheetTitle>
          <SheetDescription>
            Quelldokument-Details und extrahierter Text
          </SheetDescription>
        </SheetHeader>

        {doc ? (
          <div className="mt-6 space-y-6">
            {/* Metadata grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                  Datum
                </p>
                <p className="mt-1 text-sm text-[var(--foreground)]">
                  {formatDate(doc.date)}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                  Typ
                </p>
                <div className="mt-1">
                  <Badge variant="secondary">{typeLabels[doc.type]}</Badge>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                  Herkunft
                </p>
                <p className="mt-1 text-sm text-[var(--foreground)]">
                  {doc.origin}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                  Seiten
                </p>
                <p className="mt-1 text-sm text-[var(--foreground)]">
                  {doc.pages}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[var(--border)]" />

            {/* Extracted text */}
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                Extrahierter Text
              </p>
              <div className="rounded-md border border-[var(--border)] bg-[var(--secondary)] p-4">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--foreground)]">
                  {doc.text_excerpt}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 text-sm text-[var(--muted-foreground)]">
            Dokument nicht gefunden.
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
