"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import type { LabParameter } from "@/types/patient";

function formatDateShort(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("de-CH", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

function formatDateFull(dateStr: string): string {
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

interface LabChartProps {
  parameter: LabParameter;
}

interface ChartDataPoint {
  date: string;
  rawDate: string;
  value: number;
  source: string;
}

export function LabChart({ parameter }: LabChartProps) {
  const sorted = [...parameter.values].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const data: ChartDataPoint[] = sorted.map((v) => ({
    date: formatDateShort(v.date),
    rawDate: v.date,
    value: v.value,
    source: v.source_label,
  }));

  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-[var(--muted-foreground)]">
        Keine Werte vorhanden
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 8, right: 12, left: 0, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
            label={{
              value: parameter.unit,
              angle: -90,
              position: "insideLeft",
              style: {
                fontSize: 11,
                fill: "var(--muted-foreground)",
                textAnchor: "middle",
              },
            }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload as ChartDataPoint;
              return (
                <div className="rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 shadow-md">
                  <p className="text-xs font-medium text-[var(--foreground)]">
                    {formatDateFull(d.rawDate)}
                  </p>
                  <p className="mt-1 text-sm font-bold text-[var(--primary)]">
                    {d.value} {parameter.unit}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                    {d.source}
                  </p>
                </div>
              );
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--primary)"
            strokeWidth={2}
            dot={{
              r: 4,
              fill: "var(--primary)",
              stroke: "var(--card)",
              strokeWidth: 2,
            }}
            activeDot={{
              r: 6,
              fill: "var(--primary)",
              stroke: "var(--card)",
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
