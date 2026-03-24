import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { setPatientRecord } from "@/lib/data";
import type { PatientRecord } from "@/types/patient";

const openai = new OpenAI();

const SYSTEM_PROMPT = `Du bist ein medizinischer Dokumenten-Analyst für Schweizer Arztpraxen. Du analysierst medizinische Dokumente und extrahierst strukturierte Informationen.

WICHTIGE REGELN:
- Antworte AUSSCHLIESSLICH auf Deutsch (Schweizer Hochdeutsch).
- Verwende "ss" statt "ß" (Schweizer Standard), z.B. "grösste" statt "größte".
- Erfinde NIEMALS Informationen. Nutze NUR das, was explizit in den Dokumenten steht.
- Wenn eine Information nicht eindeutig aus den Dokumenten hervorgeht, schreibe "nicht eindeutig aus Dokumenten ersichtlich".
- Normalisiere alle Datumsangaben auf das Format YYYY-MM-DD.
- Referenziere IMMER das Quelldokument mit document_id und source_label.

Du erhältst eine Liste medizinischer Dokumente mit Dateinamen und extrahiertem Text. Analysiere diese und erstelle ein vollständiges PatientRecord-Objekt im JSON-Format.

EXAKTES JSON-SCHEMA (du MUSST dieses Schema exakt einhalten):

{
  "patient": {
    "id": "string — generiere eine eindeutige UUID",
    "name": "string — vollständiger Name des Patienten (Nachname, Vorname)",
    "date_of_birth": "string — Geburtsdatum im Format YYYY-MM-DD",
    "document_count": "number — Anzahl der analysierten Dokumente",
    "analysis_period": {
      "from": "string — frühestes Datum aus allen Dokumenten (YYYY-MM-DD)",
      "to": "string — spätestes Datum aus allen Dokumenten (YYYY-MM-DD)"
    }
  },
  "summary": {
    "executive_summary": "string — umfassende Zusammenfassung des Gesundheitsverlaufs (3-5 Sätze). Beschreibe die wichtigsten Diagnosen, Behandlungen und den Verlauf.",
    "key_takeaways": ["string — 3-6 Kernpunkte als Array von Strings"]
  },
  "diagnoses": [
    {
      "label": "string — Bezeichnung der Diagnose (z.B. 'Arterielle Hypertonie', 'Diabetes mellitus Typ 2')",
      "date": "string — Datum der Diagnosestellung (YYYY-MM-DD)",
      "source_document_id": "string — ID des Quelldokuments (doc_1, doc_2, etc.)",
      "source_label": "string — Lesbarer Name des Quelldokuments (z.B. 'Spitalbericht Kantonsspital')",
      "diagnosed_by": "string — Name des diagnostizierenden Arztes oder der Institution",
      "status": "string — 'active' | 'historical' | 'suspected'",
      "confidence": "string — 'high' wenn klar dokumentiert, 'medium' wenn impliziert, 'low' wenn unsicher"
    }
  ],
  "lab_values": [
    {
      "parameter": "string — Name des Laborparameters (z.B. 'HbA1c', 'Kreatinin', 'TSH')",
      "unit": "string — Einheit (z.B. '%', 'mmol/L', 'mU/L')",
      "values": [
        {
          "date": "string — Datum der Messung (YYYY-MM-DD)",
          "value": "number — numerischer Messwert",
          "source_document_id": "string",
          "source_label": "string"
        }
      ]
    }
  ],
  "events": [
    {
      "date": "string — Datum des Ereignisses (YYYY-MM-DD)",
      "title": "string — Kurztitel des Ereignisses",
      "description": "string — Detailbeschreibung (1-2 Sätze)",
      "source_document_id": "string",
      "source_label": "string",
      "category": "string — 'hospitalization' | 'specialist_visit' | 'diagnosis' | 'procedure' | 'lab_finding' | 'other'"
    }
  ],
  "documents": [
    {
      "id": "string — eindeutige ID (doc_1, doc_2, etc.)",
      "title": "string — aussagekräftiger Titel des Dokuments",
      "date": "string — Datum des Dokuments (YYYY-MM-DD)",
      "type": "string — 'lab_report' | 'specialist_report' | 'hospital_report' | 'gp_report' | 'radiology' | 'other'",
      "origin": "string — Absender / Institution",
      "pages": "number — Seitenanzahl (schätze anhand der Textlänge wenn nötig)",
      "text_excerpt": "string — die ersten 200 Zeichen des Dokuments als Vorschau"
    }
  ],
  "qa_examples": [
    {
      "question": "string — eine relevante medizinische Frage, die ein Arzt stellen könnte",
      "answer": "string — Antwort basierend auf den Dokumenten",
      "sources": ["string — Liste der Quelldokument-Labels"]
    }
  ]
}

ZUSÄTZLICHE ANWEISUNGEN:
- Generiere für "documents" eine fortlaufende ID: doc_1, doc_2, doc_3, etc. Verwende diese IDs konsistent in allen source_document_id-Feldern.
- Gruppiere Laborwerte nach Parameter (z.B. alle HbA1c-Werte unter einem Eintrag).
- Erstelle mindestens 3 qa_examples mit relevanten klinischen Fragen.
- Ordne Events chronologisch.
- Wenn der Patient nicht eindeutig identifizierbar ist (z.B. verschiedene Namen in verschiedenen Dokumenten), verwende den am häufigsten vorkommenden Namen und vermerke dies in der Zusammenfassung.
- Die executive_summary soll für einen Hausarzt geschrieben sein, der den Patienten übernimmt.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { documents } = body as {
      documents: { filename: string; text: string }[];
    };

    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      return NextResponse.json(
        { error: "Keine Dokumente zur Analyse übergeben." },
        { status: 400 }
      );
    }

    // Build user message with all documents
    const documentTexts = documents
      .map(
        (doc, index) =>
          `--- DOKUMENT ${index + 1}: ${doc.filename} ---\n${doc.text}\n--- ENDE DOKUMENT ${index + 1} ---`
      )
      .join("\n\n");

    const userMessage = `Analysiere die folgenden ${documents.length} medizinischen Dokumente und erstelle ein vollständiges PatientRecord-JSON-Objekt:\n\n${documentTexts}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1",
      response_format: { type: "json_object" },
      temperature: 0.1,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "Keine Antwort vom Modell erhalten." },
        { status: 502 }
      );
    }

    const record: PatientRecord = JSON.parse(content);

    // Store in memory for subsequent requests
    setPatientRecord(record);

    return NextResponse.json(record);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unbekannter Fehler";
    console.error("Analyse fehlgeschlagen:", error);
    return NextResponse.json(
      { error: `Analyse fehlgeschlagen: ${message}` },
      { status: 500 }
    );
  }
}
