import type { PatientRecord, MedicalDocument } from "@/types/patient";

/**
 * In-memory store for the current patient analysis result.
 * Suitable for a single-user prototype — not for production use.
 */
let currentRecord: PatientRecord | null = null;

/**
 * Store a patient record in memory.
 */
export function setPatientRecord(record: PatientRecord): void {
  currentRecord = record;
}

/**
 * Retrieve the current patient record, or null if none has been set.
 */
export function getPatientRecord(): PatientRecord | null {
  return currentRecord;
}

/**
 * Look up a single document by its ID from the current patient record.
 */
export function getDocument(docId: string): MedicalDocument | null {
  if (!currentRecord) return null;
  return currentRecord.documents.find((doc) => doc.id === docId) ?? null;
}

/**
 * Clear the in-memory store (useful for testing).
 */
export function clearPatientRecord(): void {
  currentRecord = null;
}
