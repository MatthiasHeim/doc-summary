"use client";

import { Stethoscope } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSourceSheet } from "@/lib/source-sheet-store";
import type { Diagnosis } from "@/types/patient";

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

const statusConfig: Record<
  Diagnosis["status"],
  { label: string; variant: "success" | "secondary" | "warning" }
> = {
  active: { label: "Aktiv", variant: "success" },
  historical: { label: "Historisch", variant: "secondary" },
  suspected: { label: "Verdacht", variant: "warning" },
};

const confidenceConfig: Record<
  Diagnosis["confidence"],
  { label: string; dots: number }
> = {
  high: { label: "Hoch", dots: 3 },
  medium: { label: "Mittel", dots: 2 },
  low: { label: "Tief", dots: 1 },
};

interface DiagnosesListProps {
  diagnoses: Diagnosis[];
}

export function DiagnosesList({ diagnoses }: DiagnosesListProps) {
  const { openSource } = useSourceSheet();

  if (diagnoses.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-[var(--primary)]" />
          Diagnosen
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                <th className="pb-2 pr-4">Diagnose</th>
                <th className="pb-2 pr-4">Datum</th>
                <th className="pb-2 pr-4">Status</th>
                <th className="pb-2 pr-4">Konfidenz</th>
                <th className="pb-2 pr-4">Arzt</th>
                <th className="pb-2">Quelle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {diagnoses.map((d, i) => {
                const status = statusConfig[d.status];
                const conf = confidenceConfig[d.confidence];
                return (
                  <tr
                    key={i}
                    className="cursor-pointer transition-colors hover:bg-[var(--secondary)]"
                    onClick={() => openSource(d.source_document_id)}
                  >
                    <td className="py-2.5 pr-4 font-medium">{d.label}</td>
                    <td className="py-2.5 pr-4 text-[var(--muted-foreground)]">
                      {formatDate(d.date)}
                    </td>
                    <td className="py-2.5 pr-4">
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </td>
                    <td className="py-2.5 pr-4">
                      <span
                        className="flex items-center gap-1"
                        title={conf.label}
                      >
                        {[1, 2, 3].map((dot) => (
                          <span
                            key={dot}
                            className={`h-2 w-2 rounded-full ${
                              dot <= conf.dots
                                ? "bg-[var(--primary)]"
                                : "bg-[var(--border)]"
                            }`}
                          />
                        ))}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 text-[var(--muted-foreground)]">
                      {d.diagnosed_by}
                    </td>
                    <td className="py-2.5">
                      <Badge variant="outline" className="text-xs">
                        {d.source_label}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
