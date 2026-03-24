import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import type { PatientRecord, MedicalDocument } from "@/types/patient";

const mockDoc: MedicalDocument = {
  id: "doc_1",
  title: "Laborbefund Januar 2024",
  date: "2024-01-15",
  type: "lab_report",
  origin: "Kantonsspital Bern",
  pages: 3,
  text_excerpt:
    "Kreatinin: 1.2 mg/dL\nHarnstoff: 45 mg/dL\nGFR: 68 ml/min",
};

const mockRecord: PatientRecord = {
  patient: {
    id: "pat-001",
    name: "Müller, Hans",
    date_of_birth: "1955-03-15",
    document_count: 1,
    analysis_period: { from: "2024-01-01", to: "2024-06-30" },
  },
  summary: { executive_summary: "Test", key_takeaways: [] },
  diagnoses: [],
  lab_values: [],
  events: [],
  documents: [mockDoc],
  qa_examples: [],
};

let currentSourceDocId: string | null = null;

vi.mock("@/lib/source-sheet-store", () => ({
  useSourceSheet: () => ({
    sourceDocId: currentSourceDocId,
    openSource: vi.fn(),
    closeSource: vi.fn(),
  }),
}));

vi.mock("@/lib/upload-store", () => ({
  useUploadStore: () => ({
    state: {
      files: [],
      extractedTexts: [],
      patientRecord: mockRecord,
      processingStage: "complete",
      errorMessage: null,
    },
  }),
}));

import { SourceDetail } from "../SourceDetail";

describe("SourceDetail", () => {
  beforeEach(() => {
    currentSourceDocId = null;
  });

  it("renders without crashing when sourceDocId is null (sheet closed)", () => {
    const { container } = render(<SourceDetail />);
    expect(container).toBeTruthy();
  });

  it("renders the default title 'Dokument' when sheet is open but doc not found", () => {
    currentSourceDocId = "nonexistent-id";
    render(<SourceDetail />);
    expect(screen.getAllByText("Dokument").length).toBeGreaterThanOrEqual(1);
  });

  it("renders 'Dokument nicht gefunden.' when doc id does not match", () => {
    currentSourceDocId = "nonexistent-id";
    render(<SourceDetail />);
    expect(
      screen.getAllByText("Dokument nicht gefunden.").length
    ).toBeGreaterThanOrEqual(1);
  });

  it("renders the document title when found", () => {
    currentSourceDocId = "doc_1";
    render(<SourceDetail />);
    expect(screen.getAllByText("Laborbefund Januar 2024").length).toBeGreaterThanOrEqual(1);
  });

  it("renders the description text", () => {
    currentSourceDocId = "doc_1";
    render(<SourceDetail />);
    expect(
      screen.getAllByText("Quelldokument-Details und extrahierter Text").length
    ).toBeGreaterThanOrEqual(1);
  });

  it("renders document metadata when doc is found", () => {
    currentSourceDocId = "doc_1";
    render(<SourceDetail />);
    expect(screen.getAllByText("Kantonsspital Bern").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("3").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Laborbericht").length).toBeGreaterThanOrEqual(1);
  });

  it("renders the extracted text excerpt", () => {
    currentSourceDocId = "doc_1";
    render(<SourceDetail />);
    expect(
      screen.getAllByText(/Kreatinin: 1.2 mg\/dL/).length
    ).toBeGreaterThanOrEqual(1);
  });
});
