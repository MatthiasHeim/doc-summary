"use client";

import { FileText } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSourceSheet } from "@/lib/source-sheet-store";
import type { MedicalDocument } from "@/types/patient";

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("de-CH", {
      day: "2-digit",
      month: "2-digit",
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

interface DocumentsListProps {
  documents: MedicalDocument[];
}

export function DocumentsList({ documents }: DocumentsListProps) {
  const { openSource } = useSourceSheet();

  if (documents.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-[var(--primary)]" />
          Dokumente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-[var(--border)]">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[var(--foreground)]">
                  {doc.title}
                </p>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="text-xs text-[var(--muted-foreground)]">
                    {formatDate(doc.date)}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {typeLabels[doc.type]}
                  </Badge>
                </div>
              </div>
              <button
                onClick={() => openSource(doc.id)}
                className="ml-3 shrink-0 rounded-md border border-[var(--border)] px-3 py-1 text-xs font-medium text-[var(--primary)] transition-colors hover:bg-[var(--accent)]"
              >
                Anzeigen
              </button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
