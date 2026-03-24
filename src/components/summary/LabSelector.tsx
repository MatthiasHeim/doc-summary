"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { LabParameter } from "@/types/patient";

interface LabSelectorProps {
  parameters: LabParameter[];
  selected: string;
  onSelect: (parameter: string) => void;
}

export function LabSelector({
  parameters,
  selected,
  onSelect,
}: LabSelectorProps) {
  if (parameters.length === 0) return null;

  return (
    <Select value={selected} onValueChange={onSelect}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Laborparameter wählen..." />
      </SelectTrigger>
      <SelectContent>
        {parameters.map((p) => (
          <SelectItem key={p.parameter} value={p.parameter}>
            {p.parameter} ({p.unit})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
