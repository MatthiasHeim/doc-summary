"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUploadStore } from "@/lib/upload-store";
import { PatientHeader } from "@/components/summary/PatientHeader";
import { ExecutiveSummary } from "@/components/summary/ExecutiveSummary";
import { DiagnosesList } from "@/components/summary/DiagnosesList";
import { Timeline } from "@/components/summary/Timeline";
import { LabSection } from "@/components/summary/LabSection";
import { QuickQuestions } from "@/components/summary/QuickQuestions";
import { DocumentsList } from "@/components/summary/DocumentsList";
import { SourceDetail } from "@/components/documents/SourceDetail";

export default function SummaryPage() {
  const router = useRouter();
  const { state } = useUploadStore();
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

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <main className="mx-auto max-w-7xl px-6 py-6">
        {/* Patient header -- full width */}
        <PatientHeader patient={record.patient} />

        {/* Two-column layout */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
          {/* Left column */}
          <div className="space-y-6">
            <ExecutiveSummary summary={record.summary} />
            <DiagnosesList diagnoses={record.diagnoses} />
            <Timeline events={record.events} />
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <LabSection labValues={record.lab_values} />
            <QuickQuestions />
            <DocumentsList documents={record.documents} />
          </div>
        </div>
      </main>

      {/* Source detail sheet -- global */}
      <SourceDetail />
    </div>
  );
}
