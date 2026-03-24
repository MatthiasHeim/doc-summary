"use client";

import { User, Calendar, FileText } from "lucide-react";
import type { Patient } from "@/types/patient";

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

interface PatientHeaderProps {
  patient: Patient;
}

export function PatientHeader({ patient }: PatientHeaderProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--card)] px-6 py-4 shadow-sm">
      {/* Patient identity */}
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)] text-white">
          <User className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[var(--foreground)]">
            {patient.name}
          </h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            geb. {formatDate(patient.date_of_birth)}
          </p>
        </div>
      </div>

      {/* Meta info */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
          <Calendar className="h-4 w-4" />
          <span>
            Analysezeitraum: {formatDate(patient.analysis_period.from)} &ndash;{" "}
            {formatDate(patient.analysis_period.to)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
          <FileText className="h-4 w-4" />
          <span>
            {patient.document_count}{" "}
            {patient.document_count === 1 ? "Dokument" : "Dokumente"}
          </span>
        </div>
      </div>
    </div>
  );
}
