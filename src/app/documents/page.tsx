"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUploadStore } from "@/lib/upload-store";
import { useSourceSheet } from "@/lib/source-sheet-store";
import { SourceDetail } from "@/components/documents/SourceDetail";
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
  lab_report: "Labor",
  specialist_report: "Spezialist",
  hospital_report: "Spital",
  gp_report: "Hausarzt",
  radiology: "Radiologie",
  other: "Andere",
};

const typeVariants: Record<
  MedicalDocument["type"],
  "default" | "secondary" | "success" | "warning" | "outline"
> = {
  lab_report: "default",
  specialist_report: "secondary",
  hospital_report: "warning",
  gp_report: "success",
  radiology: "outline",
  other: "secondary",
};

export default function DocumentsPage() {
  const router = useRouter();
  const { state } = useUploadStore();
  const { openSource } = useSourceSheet();
  const record = state.patientRecord;

  useEffect(() => {
    if (!record) {
      router.replace("/");
    }
  }, [record, router]);

  if (!record) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-[var(--muted-foreground)]">Lade...</p>
      </div>
    );
  }

  const documents = record.documents;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-5 flex items-center gap-2.5">
          <FileText className="h-5 w-5 text-[var(--primary)]" />
          <h1 className="text-lg font-semibold text-[var(--foreground)]">
            {documents.length}{" "}
            {documents.length === 1
              ? "verarbeitetes Dokument"
              : "verarbeitete Dokumente"}
          </h1>
        </div>

        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--secondary)]/60 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                <th className="px-5 py-3">Titel</th>
                <th className="px-4 py-3">Datum</th>
                <th className="px-4 py-3">Typ</th>
                <th className="px-4 py-3">Herkunft</th>
                <th className="px-4 py-3 text-right">Seiten</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {documents.map((doc) => (
                <tr
                  key={doc.id}
                  className="transition-colors hover:bg-[var(--accent)]/30"
                >
                  <td className="px-5 py-3.5 font-medium text-[var(--foreground)]">
                    {doc.title}
                  </td>
                  <td className="px-4 py-3.5 tabular-nums text-[var(--muted-foreground)]">
                    {formatDate(doc.date)}
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant={typeVariants[doc.type]}>
                      {typeLabels[doc.type]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5 text-[var(--muted-foreground)]">
                    {doc.origin}
                  </td>
                  <td className="px-4 py-3.5 text-right tabular-nums text-[var(--muted-foreground)]">
                    {doc.pages}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => openSource(doc.id)}
                      className="rounded-md border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--primary)] shadow-sm transition-all hover:bg-[var(--accent)] hover:shadow-md"
                    >
                      Anzeigen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Source detail sheet */}
      <SourceDetail />
    </div>
  );
}
