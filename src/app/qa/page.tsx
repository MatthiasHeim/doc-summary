"use client";

import { Suspense } from "react";
import { QAContent } from "@/components/qa/QAContent";

export default function QAPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-sm text-[var(--muted-foreground)]">Lade...</p>
        </div>
      }
    >
      <QAContent />
    </Suspense>
  );
}
