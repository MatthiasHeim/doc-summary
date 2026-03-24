import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DiagnosesList } from "../DiagnosesList";
import type { Diagnosis } from "@/types/patient";

const mockOpenSource = vi.fn();

vi.mock("@/lib/source-sheet-store", () => ({
  useSourceSheet: () => ({
    sourceDocId: null,
    openSource: mockOpenSource,
    closeSource: vi.fn(),
  }),
}));

const mockDiagnoses: Diagnosis[] = [
  {
    label: "Arterielle Hypertonie",
    date: "2023-05-10",
    source_document_id: "doc_1",
    source_label: "Hausarztbericht 10.05.2023",
    diagnosed_by: "Dr. med. Weber",
    status: "active",
    confidence: "high",
  },
  {
    label: "Diabetes mellitus Typ 2",
    date: "2022-11-20",
    source_document_id: "doc_2",
    source_label: "Laborbefund 20.11.2022",
    diagnosed_by: "Dr. med. Fischer",
    status: "suspected",
    confidence: "medium",
  },
  {
    label: "Appendektomie",
    date: "1990-06-15",
    source_document_id: "doc_3",
    source_label: "Spitalbericht 15.06.1990",
    diagnosed_by: "Dr. med. Schmid",
    status: "historical",
    confidence: "low",
  },
];

describe("DiagnosesList", () => {
  beforeEach(() => {
    mockOpenSource.mockClear();
  });

  it("renders nothing when diagnoses array is empty", () => {
    const { container } = render(<DiagnosesList diagnoses={[]} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders the card title 'Diagnosen'", () => {
    render(<DiagnosesList diagnoses={mockDiagnoses} />);
    expect(screen.getAllByText("Diagnosen").length).toBeGreaterThanOrEqual(1);
  });

  it("renders all table headers", () => {
    render(<DiagnosesList diagnoses={mockDiagnoses} />);
    expect(screen.getAllByText("Diagnose").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Datum").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Status").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Konfidenz").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Arzt").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Quelle").length).toBeGreaterThanOrEqual(1);
  });

  it("renders all diagnosis labels", () => {
    render(<DiagnosesList diagnoses={mockDiagnoses} />);
    expect(screen.getAllByText("Arterielle Hypertonie").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Diabetes mellitus Typ 2").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Appendektomie").length).toBeGreaterThanOrEqual(1);
  });

  it("renders status badges with correct labels", () => {
    render(<DiagnosesList diagnoses={mockDiagnoses} />);
    expect(screen.getAllByText("Aktiv").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Verdacht").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Historisch").length).toBeGreaterThanOrEqual(1);
  });

  it("renders doctor names", () => {
    render(<DiagnosesList diagnoses={mockDiagnoses} />);
    expect(screen.getAllByText("Dr. med. Weber").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Dr. med. Fischer").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Dr. med. Schmid").length).toBeGreaterThanOrEqual(1);
  });

  it("renders source labels", () => {
    render(<DiagnosesList diagnoses={mockDiagnoses} />);
    expect(
      screen.getAllByText("Hausarztbericht 10.05.2023").length
    ).toBeGreaterThanOrEqual(1);
  });

  it("calls openSource with document id when a row is clicked", () => {
    render(<DiagnosesList diagnoses={mockDiagnoses} />);
    const rows = screen.getAllByText("Arterielle Hypertonie");
    const row = rows[0].closest("tr")!;
    fireEvent.click(row);
    expect(mockOpenSource).toHaveBeenCalledWith("doc_1");
  });
});
