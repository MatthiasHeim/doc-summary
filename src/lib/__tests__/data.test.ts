import { describe, it, expect, beforeEach } from "vitest";
import {
  setPatientRecord,
  getPatientRecord,
  getDocument,
  clearPatientRecord,
} from "@/lib/data";
import type { PatientRecord } from "@/types/patient";

const mockRecord: PatientRecord = {
  patient: {
    id: "test-123",
    name: "Müller, Hans",
    date_of_birth: "1955-03-15",
    document_count: 2,
    analysis_period: { from: "2024-01-01", to: "2024-06-30" },
  },
  summary: {
    executive_summary: "Testpatient mit Hypertonie.",
    key_takeaways: ["Arterielle Hypertonie", "Stabile Nierenfunktion"],
  },
  diagnoses: [],
  lab_values: [],
  events: [],
  documents: [
    {
      id: "doc_1",
      title: "Laborbefund",
      date: "2024-01-15",
      type: "lab_report",
      origin: "Kantonsspital",
      pages: 2,
      text_excerpt: "Laborwerte vom 15.01.2024...",
    },
    {
      id: "doc_2",
      title: "Spitalbericht",
      date: "2024-03-20",
      type: "hospital_report",
      origin: "Universitätsspital",
      pages: 5,
      text_excerpt: "Sehr geehrte Kollegin...",
    },
  ],
  qa_examples: [],
};

describe("data store", () => {
  beforeEach(() => {
    clearPatientRecord();
  });

  it("should return null when no record is set", () => {
    expect(getPatientRecord()).toBeNull();
  });

  it("should store and retrieve a patient record", () => {
    setPatientRecord(mockRecord);
    const result = getPatientRecord();
    expect(result).toEqual(mockRecord);
  });

  it("should find a document by ID", () => {
    setPatientRecord(mockRecord);
    const doc = getDocument("doc_1");
    expect(doc).not.toBeNull();
    expect(doc!.title).toBe("Laborbefund");
  });

  it("should return null for unknown document ID", () => {
    setPatientRecord(mockRecord);
    expect(getDocument("doc_999")).toBeNull();
  });

  it("should return null for document lookup when no record exists", () => {
    expect(getDocument("doc_1")).toBeNull();
  });
});
