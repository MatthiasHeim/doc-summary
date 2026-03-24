"use client";

import { User, Calendar, FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Patient } from "@/types/patient";

interface PatientHeaderProps {
  patient: Patient;
}

export function PatientHeader({ patient }: PatientHeaderProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-white px-6 py-5 shadow-sm">
      {/* Patient identity */}
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-sm">
          <User className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[var(--foreground)]">
            {patient.name}
          </h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            geb. {formatDate(patient.date_of_birth)}
          </p>
        </div>
      </div>

      {/* Meta info */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 rounded-lg bg-[var(--secondary)] px-3 py-2 text-sm text-[var(--secondary-foreground)]">
          <Calendar className="h-4 w-4 text-[var(--muted-foreground)]" />
          <span>
            {formatDate(patient.analysis_period.from)} &ndash;{" "}
            {formatDate(patient.analysis_period.to)}
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-[var(--secondary)] px-3 py-2 text-sm text-[var(--secondary-foreground)]">
          <FileText className="h-4 w-4 text-[var(--muted-foreground)]" />
          <span>
            {patient.document_count}{" "}
            {patient.document_count === 1 ? "Dokument" : "Dokumente"}
          </span>
        </div>
      </div>
    </div>
  );
}
