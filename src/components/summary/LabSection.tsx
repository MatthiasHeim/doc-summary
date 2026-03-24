"use client";

import { useState } from "react";
import { FlaskConical } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { LabSelector } from "./LabSelector";
import { LabChart } from "./LabChart";
import type { LabParameter } from "@/types/patient";

interface LabSectionProps {
  labValues: LabParameter[];
}

export function LabSection({ labValues }: LabSectionProps) {
  const [selected, setSelected] = useState<string>(
    labValues[0]?.parameter ?? ""
  );

  const selectedParam = labValues.find((p) => p.parameter === selected);

  if (labValues.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-[var(--primary)]" />
          Laborwerte
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <LabSelector
          parameters={labValues}
          selected={selected}
          onSelect={setSelected}
        />
        {selectedParam && <LabChart parameter={selectedParam} />}
      </CardContent>
    </Card>
  );
}
