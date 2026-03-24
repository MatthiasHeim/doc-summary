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
import { formatDateLong, safeDateSort } from "@/lib/utils";
import type { MedicalEvent } from "@/types/patient";

const categoryConfig: Record<
  MedicalEvent["category"],
  { icon: React.ComponentType<{ className?: string }>; color: string; bgColor: string }
> = {
  hospitalization: { icon: Building2, color: "text-red-600", bgColor: "bg-red-50 ring-red-100" },
  specialist_visit: { icon: UserRound, color: "text-blue-600", bgColor: "bg-blue-50 ring-blue-100" },
  diagnosis: { icon: Stethoscope, color: "text-purple-600", bgColor: "bg-purple-50 ring-purple-100" },
  procedure: { icon: Scissors, color: "text-orange-600", bgColor: "bg-orange-50 ring-orange-100" },
  lab_finding: { icon: FlaskConical, color: "text-teal-600", bgColor: "bg-teal-50 ring-teal-100" },
  other: { icon: CircleDot, color: "text-gray-600", bgColor: "bg-gray-50 ring-gray-100" },
};

interface TimelineProps {
  events: MedicalEvent[];
}

export function Timeline({ events }: TimelineProps) {
  const { openSource } = useSourceSheet();

  if (events.length === 0) return null;

  const sorted = [...events].sort((a, b) => safeDateSort(b.date, a.date));

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <CircleDot className="h-5 w-5 text-[var(--primary)]" />
          Verlauf
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Continuous vertical line */}
          <div className="absolute left-[17px] top-0 bottom-0 w-px bg-gradient-to-b from-[var(--border)] via-[var(--border)] to-transparent" />

          <div className="space-y-0">
            {sorted.map((event, i) => {
              const cfg = categoryConfig[event.category] ?? categoryConfig.other;
              const Icon = cfg.icon;

              return (
                <div
                  key={i}
                  className="group relative flex gap-4 pb-6 last:pb-0"
                >
                  {/* Icon dot */}
                  <div
                    className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-2 ${cfg.bgColor} ${cfg.color} transition-shadow group-hover:ring-4`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  {/* Content */}
                  <div
                    className="flex-1 cursor-pointer rounded-lg border border-transparent px-3.5 py-2 transition-all hover:border-[var(--border)] hover:bg-[var(--secondary)]/50 hover:shadow-sm"
                    onClick={() => openSource(event.source_document_id)}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-[var(--foreground)]">
                        {event.title}
                      </h4>
                      <span className="shrink-0 rounded-md bg-[var(--secondary)] px-2 py-0.5 text-xs tabular-nums text-[var(--muted-foreground)]">
                        {formatDateLong(event.date)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--muted-foreground)]">
                      {event.description}
                    </p>
                    <Badge variant="outline" className="mt-2 text-xs font-normal">
                      {event.source_label}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
