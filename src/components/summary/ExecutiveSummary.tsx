"use client";

import { Sparkles } from "lucide-react";
import type { Summary } from "@/types/patient";

interface ExecutiveSummaryProps {
  summary: Summary;
}

export function ExecutiveSummary({ summary }: ExecutiveSummaryProps) {
  return (
    <div className="rounded-xl border border-[var(--summary-border)] bg-gradient-to-br from-[var(--summary-bg)] to-white p-6 shadow-sm">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-white">
          <Sparkles className="h-4 w-4" />
        </div>
        <h2 className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
          Zusammenfassung
        </h2>
      </div>

      <p className="text-[15px] leading-[1.7] text-[var(--foreground)]">
        {summary.executive_summary}
      </p>

      {summary.key_takeaways.length > 0 && (
        <div className="mt-5 space-y-2.5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            Wichtige Erkenntnisse
          </h3>
          <ul className="space-y-2">
            {summary.key_takeaways.map((takeaway, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-lg bg-white/80 border border-[var(--summary-border)]/50 px-4 py-2.5 text-sm leading-relaxed text-[var(--foreground)]"
              >
                <span className="mt-1.5 block h-2 w-2 shrink-0 rounded-full bg-[var(--primary)]" />
                {takeaway}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
