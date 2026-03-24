import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI();

const SYSTEM_PROMPT = `Du bist ein medizinischer Assistent für Schweizer Arztpraxen. Du beantwortest Fragen basierend ausschliesslich auf den bereitgestellten medizinischen Dokumenten.

REGELN:
- Antworte IMMER auf Deutsch (Schweizer Hochdeutsch). Verwende "ss" statt "ß".
- Stütze dich NUR auf Informationen aus den bereitgestellten Dokumenten.
- Wenn die Antwort nicht aus den Dokumenten hervorgeht, sage dies klar: "Diese Information ist aus den vorliegenden Dokumenten nicht ersichtlich."
- Zitiere die Quelldokumente am Ende deiner Antwort.
- Sei präzise und fasse dich kurz (maximal 3-4 Sätze für die Antwort).
- Verwende medizinische Fachbegriffe, aber erkläre sie bei Bedarf.
- Erfinde NIEMALS Informationen oder Laborwerte.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, context } = body as {
      question: string;
      context: string;
    };

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Keine Frage übergeben." },
        { status: 400 }
      );
    }

    if (!context || typeof context !== "string") {
      return NextResponse.json(
        { error: "Kein Dokumentenkontext übergeben." },
        { status: 400 }
      );
    }

    const userMessage = `MEDIZINISCHE DOKUMENTE:\n${context}\n\nFRAGE: ${question}\n\nAntworte im folgenden JSON-Format:\n{"answer": "deine Antwort hier", "sources": ["Quelldokument 1", "Quelldokument 2"]}`;

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

    const result = JSON.parse(content) as {
      answer: string;
      sources: string[];
    };

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unbekannter Fehler";
    console.error("Q&A fehlgeschlagen:", error);
    return NextResponse.json(
      { error: `Q&A fehlgeschlagen: ${message}` },
      { status: 500 }
    );
  }
}
