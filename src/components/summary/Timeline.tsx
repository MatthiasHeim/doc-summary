"use client";

import {
  Building2,
  UserRound,
  Stethoscope,
  Scissors,
  FlaskConical,
  CircleDot,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSourceSheet } from "@/lib/source-sheet-store";
import type { MedicalEvent } from "@/types/patient";

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

const categoryConfig: Record<
  MedicalEvent["category"],
  { icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  hospitalization: { icon: Building2, color: "text-red-600 bg-red-50" },
  specialist_visit: { icon: UserRound, color: "text-blue-600 bg-blue-50" },
  diagnosis: { icon: Stethoscope, color: "text-purple-600 bg-purple-50" },
  procedure: { icon: Scissors, color: "text-orange-600 bg-orange-50" },
  lab_finding: { icon: FlaskConical, color: "text-teal-600 bg-teal-50" },
  other: { icon: CircleDot, color: "text-gray-600 bg-gray-50" },
};

interface TimelineProps {
  events: MedicalEvent[];
}

export function Timeline({ events }: TimelineProps) {
  const { openSource } = useSourceSheet();

  if (events.length === 0) return null;

  const sorted = [...events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <CircleDot className="h-5 w-5 text-[var(--primary)]" />
          Verlauf
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-0">
          {/* Vertical line */}
          <div className="absolute left-[17px] top-2 bottom-2 w-px bg-[var(--border)]" />

          {sorted.map((event, i) => {
            const cfg = categoryConfig[event.category];
            const Icon = cfg.icon;

            return (
              <div
                key={i}
                className="group relative flex gap-4 pb-6 last:pb-0"
              >
                {/* Icon dot */}
                <div
                  className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${cfg.color}`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                {/* Content */}
                <div
                  className="flex-1 cursor-pointer rounded-md border border-transparent px-3 py-1.5 transition-colors hover:border-[var(--border)] hover:bg-[var(--secondary)]"
                  onClick={() => openSource(event.source_document_id)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold text-[var(--foreground)]">
                      {event.title}
                    </h4>
                    <span className="shrink-0 text-xs text-[var(--muted-foreground)]">
                      {formatDate(event.date)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm leading-relaxed text-[var(--muted-foreground)]">
                    {event.description}
                  </p>
                  <Badge variant="outline" className="mt-1.5 text-xs">
                    {event.source_label}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
