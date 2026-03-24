"use client";

import { Sparkles } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import type { Summary } from "@/types/patient";

interface ExecutiveSummaryProps {
  summary: Summary;
}

export function ExecutiveSummary({ summary }: ExecutiveSummaryProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[var(--primary)]" />
          Zusammenfassung
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed text-[var(--foreground)]">
          {summary.executive_summary}
        </p>

        {summary.key_takeaways.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              Wichtige Erkenntnisse
            </h3>
            <ul className="space-y-1.5">
              {summary.key_takeaways.map((takeaway, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 rounded-md bg-[var(--accent)] px-3 py-2 text-sm text-[var(--accent-foreground)]"
                >
                  <span className="mt-0.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--primary)]" />
                  {takeaway}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
