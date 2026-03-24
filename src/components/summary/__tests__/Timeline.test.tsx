import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Timeline } from "../Timeline";
import type { MedicalEvent } from "@/types/patient";

const mockOpenSource = vi.fn();

vi.mock("@/lib/source-sheet-store", () => ({
  useSourceSheet: () => ({
    sourceDocId: null,
    openSource: mockOpenSource,
    closeSource: vi.fn(),
  }),
}));

const mockEvents: MedicalEvent[] = [
  {
    date: "2024-03-15",
    title: "Kardiologische Kontrolle",
    description: "Belastungs-EKG unauffällig, Blutdruck gut eingestellt.",
    source_document_id: "doc_1",
    source_label: "Kardiologie Bericht",
    category: "specialist_visit",
  },
  {
    date: "2024-01-10",
    title: "Spitalaufenthalt Inselspital",
    description: "Stationäre Aufnahme wegen Brustschmerzen, Ausschluss ACS.",
    source_document_id: "doc_2",
    source_label: "Spitalbericht Inselspital",
    category: "hospitalization",
  },
  {
    date: "2023-11-05",
    title: "Laboruntersuchung",
    description: "HbA1c 6.8%, Kreatinin leicht erhöht.",
    source_document_id: "doc_3",
    source_label: "Laborbefund November",
    category: "lab_finding",
  },
];

describe("Timeline", () => {
  beforeEach(() => {
    mockOpenSource.mockClear();
  });

  it("renders nothing when events array is empty", () => {
    const { container } = render(<Timeline events={[]} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders the card title 'Verlauf'", () => {
    render(<Timeline events={mockEvents} />);
    expect(screen.getAllByText("Verlauf").length).toBeGreaterThanOrEqual(1);
  });

  it("renders all event titles", () => {
    render(<Timeline events={mockEvents} />);
    expect(screen.getAllByText("Kardiologische Kontrolle").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Spitalaufenthalt Inselspital").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Laboruntersuchung").length).toBeGreaterThanOrEqual(1);
  });

  it("renders event descriptions", () => {
    render(<Timeline events={mockEvents} />);
    expect(
      screen.getAllByText(
        "Belastungs-EKG unauffällig, Blutdruck gut eingestellt."
      ).length
    ).toBeGreaterThanOrEqual(1);
  });

  it("renders source labels as badges", () => {
    render(<Timeline events={mockEvents} />);
    expect(screen.getAllByText("Kardiologie Bericht").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Spitalbericht Inselspital").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Laborbefund November").length).toBeGreaterThanOrEqual(1);
  });

  it("sorts events by date descending (newest first)", () => {
    render(<Timeline events={mockEvents} />);
    // Get all h4 elements which contain event titles
    const allTitles = screen.getAllByText(
      /Kardiologische Kontrolle|Spitalaufenthalt Inselspital|Laboruntersuchung/
    );
    // Filter to get unique title texts in order (there may be duplicates from React 19 StrictMode)
    const seen = new Set<string>();
    const orderedTitles: string[] = [];
    for (const el of allTitles) {
      const text = el.textContent!;
      if (!seen.has(text)) {
        seen.add(text);
        orderedTitles.push(text);
      }
    }
    expect(orderedTitles[0]).toBe("Kardiologische Kontrolle");
    expect(orderedTitles[1]).toBe("Spitalaufenthalt Inselspital");
    expect(orderedTitles[2]).toBe("Laboruntersuchung");
  });

  it("calls openSource when an event is clicked", () => {
    render(<Timeline events={mockEvents} />);
    const elements = screen.getAllByText("Kardiologische Kontrolle");
    const eventContent = elements[0].closest("[class*='cursor-pointer']")!;
    fireEvent.click(eventContent);
    expect(mockOpenSource).toHaveBeenCalledWith("doc_1");
  });
});
