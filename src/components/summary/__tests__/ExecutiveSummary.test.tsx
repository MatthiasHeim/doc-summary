import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ExecutiveSummary } from "../ExecutiveSummary";
import type { Summary } from "@/types/patient";

const mockSummary: Summary = {
  executive_summary:
    "Patient mit langjähriger arterieller Hypertonie und chronischer Niereninsuffizienz Stadium III.",
  key_takeaways: [
    "Arterielle Hypertonie seit 2015",
    "Chronische Niereninsuffizienz Stadium III",
    "Regelmässige kardiologische Kontrollen empfohlen",
  ],
};

describe("ExecutiveSummary", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the card title 'Zusammenfassung'", () => {
    render(<ExecutiveSummary summary={mockSummary} />);
    expect(screen.getAllByText("Zusammenfassung").length).toBeGreaterThanOrEqual(1);
  });

  it("renders the executive summary text", () => {
    render(<ExecutiveSummary summary={mockSummary} />);
    expect(
      screen.getAllByText(mockSummary.executive_summary).length
    ).toBeGreaterThanOrEqual(1);
  });

  it("renders the 'Wichtige Erkenntnisse' heading", () => {
    render(<ExecutiveSummary summary={mockSummary} />);
    expect(
      screen.getAllByText("Wichtige Erkenntnisse").length
    ).toBeGreaterThanOrEqual(1);
  });

  it("renders all key takeaways", () => {
    render(<ExecutiveSummary summary={mockSummary} />);
    for (const takeaway of mockSummary.key_takeaways) {
      expect(screen.getAllByText(takeaway).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("does not render key takeaways section when empty", () => {
    const emptySummary: Summary = {
      executive_summary: "Kurze Zusammenfassung.",
      key_takeaways: [],
    };
    render(<ExecutiveSummary summary={emptySummary} />);
    expect(
      screen.queryAllByText("Wichtige Erkenntnisse").length
    ).toBeLessThanOrEqual(0);
  });
});
