"use client";

import { FileText, ChevronRight } from "lucide-react";
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
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[var(--primary)]" />
            Dokumente
          </CardTitle>
          <span className="text-xs text-[var(--muted-foreground)]">
            {documents.length} Dateien
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-[var(--border)]">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className="group flex items-center justify-between py-3 first:pt-0 last:pb-0 cursor-pointer transition-colors hover:bg-[var(--secondary)]/30 -mx-2 px-2 rounded-md"
              onClick={() => openSource(doc.id)}
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--primary)]">
                  {doc.title}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xs tabular-nums text-[var(--muted-foreground)]">
                    {formatDate(doc.date)}
                  </span>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    {typeLabels[doc.type]}
                  </Badge>
                </div>
              </div>
              <ChevronRight className="ml-2 h-4 w-4 shrink-0 text-[var(--muted-foreground)] opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
