import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PatientHeader } from "../PatientHeader";
import type { Patient } from "@/types/patient";

const mockPatient: Patient = {
  id: "pat-001",
  name: "Müller, Hans",
  date_of_birth: "1955-03-15",
  document_count: 5,
  analysis_period: {
    from: "2023-01-01",
    to: "2024-06-30",
  },
};

describe("PatientHeader", () => {
  it("renders the patient name", () => {
    render(<PatientHeader patient={mockPatient} />);
    expect(screen.getAllByText("Müller, Hans").length).toBeGreaterThanOrEqual(1);
  });

  it("renders the date of birth with 'geb.' prefix", () => {
    render(<PatientHeader patient={mockPatient} />);
    const elements = screen.getAllByText(/geb\./);
    expect(elements.length).toBeGreaterThanOrEqual(1);
    expect(elements[0].textContent).toContain("15.03.1955");
  });

  it("renders the analysis period dates", () => {
    render(<PatientHeader patient={mockPatient} />);
    // The component no longer has "Analysezeitraum:" label, it just shows dates
    const elements = screen.getAllByText(/01\.01\.2023/);
    expect(elements.length).toBeGreaterThanOrEqual(1);
  });

  it("renders the document count with plural 'Dokumente'", () => {
    render(<PatientHeader patient={mockPatient} />);
    const elements = screen.getAllByText(/5\s+Dokumente/);
    expect(elements.length).toBeGreaterThanOrEqual(1);
  });

  it("renders singular 'Dokument' for count of 1", () => {
    const singleDocPatient: Patient = {
      ...mockPatient,
      document_count: 1,
    };
    render(<PatientHeader patient={singleDocPatient} />);
    const elements = screen.getAllByText(/1\s+Dokument/);
    expect(elements[0].textContent).not.toMatch(/Dokumente/);
  });
});
