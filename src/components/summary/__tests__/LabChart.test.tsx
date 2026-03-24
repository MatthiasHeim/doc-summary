import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { LabParameter } from "@/types/patient";

// Mock recharts since jsdom cannot render SVG charts
vi.mock("recharts", () => ({
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  Tooltip: () => <div data-testid="tooltip" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  ResponsiveContainer: ({ children }: any) => (
    <div data-testid="responsive-container">{children}</div>
  ),
}));

import { LabChart } from "../LabChart";

const mockParameter: LabParameter = {
  parameter: "Kreatinin",
  unit: "mg/dL",
  values: [
    {
      date: "2024-01-15",
      value: 1.2,
      source_document_id: "doc_1",
      source_label: "Laborbefund Januar",
    },
    {
      date: "2024-03-20",
      value: 1.4,
      source_document_id: "doc_2",
      source_label: "Laborbefund März",
    },
    {
      date: "2024-06-10",
      value: 1.1,
      source_document_id: "doc_3",
      source_label: "Laborbefund Juni",
    },
  ],
};

describe("LabChart", () => {
  it("renders the chart container when values exist", () => {
    render(<LabChart parameter={mockParameter} />);
    expect(screen.getAllByTestId("responsive-container").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByTestId("line-chart").length).toBeGreaterThanOrEqual(1);
  });

  it("renders the empty state when values are empty", () => {
    const emptyParam: LabParameter = {
      parameter: "Kreatinin",
      unit: "mg/dL",
      values: [],
    };
    render(<LabChart parameter={emptyParam} />);
    expect(screen.getAllByText("Keine Werte vorhanden").length).toBeGreaterThanOrEqual(1);
  });

  it("does not crash with a single data point", () => {
    const singleParam: LabParameter = {
      parameter: "HbA1c",
      unit: "%",
      values: [
        {
          date: "2024-01-15",
          value: 6.5,
          source_document_id: "doc_1",
          source_label: "Laborbefund",
        },
      ],
    };
    render(<LabChart parameter={singleParam} />);
    expect(screen.getAllByTestId("line-chart").length).toBeGreaterThanOrEqual(1);
  });
});
