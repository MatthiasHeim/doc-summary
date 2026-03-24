export interface Patient {
  id: string;
  name: string;
  date_of_birth: string;
  document_count: number;
  analysis_period: {
    from: string;
    to: string;
  };
}

export interface Summary {
  executive_summary: string;
  key_takeaways: string[];
}

export interface Diagnosis {
  label: string;
  date: string;
  source_document_id: string;
  source_label: string;
  diagnosed_by: string;
  status: "active" | "historical" | "suspected";
  confidence: "high" | "medium" | "low";
}

export interface LabValue {
  date: string;
  value: number;
  source_document_id: string;
  source_label: string;
}

export interface LabParameter {
  parameter: string;
  unit: string;
  values: LabValue[];
}

export interface MedicalEvent {
  date: string;
  title: string;
  description: string;
  source_document_id: string;
  source_label: string;
  category:
    | "hospitalization"
    | "specialist_visit"
    | "diagnosis"
    | "procedure"
    | "lab_finding"
    | "other";
}

export interface MedicalDocument {
  id: string;
  title: string;
  date: string;
  type:
    | "lab_report"
    | "specialist_report"
    | "hospital_report"
    | "gp_report"
    | "radiology"
    | "other";
  origin: string;
  pages: number;
  text_excerpt: string;
}

export interface QAExample {
  question: string;
  answer: string;
  sources: string[];
}

export interface PatientRecord {
  patient: Patient;
  summary: Summary;
  diagnoses: Diagnosis[];
  lab_values: LabParameter[];
  events: MedicalEvent[];
  documents: MedicalDocument[];
  qa_examples: QAExample[];
}
