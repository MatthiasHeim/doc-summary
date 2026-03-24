import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import type { PatientRecord } from "@/types/patient";

// Mock next/navigation
const mockPush = vi.fn();
const mockReplace = vi.fn();
const mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
  useSearchParams: () => mockSearchParams,
}));

// Mock source-sheet-store
vi.mock("@/lib/source-sheet-store", () => ({
  useSourceSheet: () => ({
    sourceDocId: null,
    openSource: vi.fn(),
    closeSource: vi.fn(),
  }),
  SourceSheetProvider: ({ children }: any) => <>{children}</>,
}));

// Mock SourceDetail since it also uses context
vi.mock("@/components/documents/SourceDetail", () => ({
  SourceDetail: () => <div data-testid="source-detail" />,
}));

const mockRecord: PatientRecord = {
  patient: {
    id: "pat-001",
    name: "Müller, Hans",
    date_of_birth: "1955-03-15",
    document_count: 3,
    analysis_period: { from: "2023-01-01", to: "2024-06-30" },
  },
  summary: {
    executive_summary: "Testpatient",
    key_takeaways: [],
  },
  diagnoses: [],
  lab_values: [],
  events: [],
  documents: [
    {
      id: "doc_1",
      title: "Laborbefund Januar",
      date: "2024-01-15",
      type: "lab_report",
      origin: "Kantonsspital Bern",
      pages: 2,
      text_excerpt: "Kreatinin 1.2 mg/dL...",
    },
  ],
  qa_examples: [],
};

let currentRecord: PatientRecord | null = mockRecord;

vi.mock("@/lib/upload-store", () => ({
  useUploadStore: () => ({
    state: {
      files: [],
      extractedTexts: [],
      patientRecord: currentRecord,
      processingStage: "complete",
      errorMessage: null,
    },
  }),
}));

import { QAContent } from "../QAContent";

describe("QAContent", () => {
  beforeEach(() => {
    currentRecord = mockRecord;
    mockReplace.mockClear();
  });

  it("renders loading state when no patient record is available", () => {
    currentRecord = null;
    render(<QAContent />);
    expect(screen.getAllByText("Lade...").length).toBeGreaterThanOrEqual(1);
  });

  it("redirects to home when no patient record", () => {
    currentRecord = null;
    render(<QAContent />);
    expect(mockReplace).toHaveBeenCalledWith("/");
  });

  it("renders the page heading", () => {
    render(<QAContent />);
    expect(screen.getAllByText("Fragen & Antworten").length).toBeGreaterThanOrEqual(1);
  });

  it("renders all quick question chips", () => {
    render(<QAContent />);
    expect(
      screen.getAllByText("Diagnosen der letzten 5 Jahre").length
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Wichtige Spitalaufenthalte").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("PSA-Verlauf").length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getAllByText("Kardiologische Ereignisse").length
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Aktuelle Medikation").length).toBeGreaterThanOrEqual(1);
  });

  it("renders the question input field", () => {
    render(<QAContent />);
    const inputs = screen.getAllByPlaceholderText(
      "Stellen Sie eine Frage zu den Patientendokumenten..."
    );
    expect(inputs.length).toBeGreaterThanOrEqual(1);
  });

  it("renders the submit button with 'Fragen' text", () => {
    render(<QAContent />);
    const buttons = screen.getAllByRole("button", { name: /Fragen/ });
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });
});
