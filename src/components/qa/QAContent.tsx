"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Send, Loader2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUploadStore } from "@/lib/upload-store";
import { useSourceSheet } from "@/lib/source-sheet-store";
import { SourceDetail } from "@/components/documents/SourceDetail";

const QUICK_QUESTIONS = [
  "Diagnosen der letzten 5 Jahre",
  "Wichtige Spitalaufenthalte",
  "PSA-Verlauf",
  "Kardiologische Ereignisse",
  "Aktuelle Medikation",
];

interface QAResult {
  answer: string;
  sources: string[];
}

export function QAContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state } = useUploadStore();
  const { openSource } = useSourceSheet();
  const record = state.patientRecord;

  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QAResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!record) {
      router.replace("/");
    }
  }, [record, router]);

  const askQuestion = useCallback(
    async (q: string) => {
      if (!q.trim() || !record) return;
      setLoading(true);
      setError(null);
      setResult(null);

      try {
        const context = record.documents
          .map(
            (doc) =>
              `[${doc.title} | ${doc.date} | ${doc.origin}]\n${doc.text_excerpt}`
          )
          .join("\n\n---\n\n");

        const res = await fetch("/api/qa", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: q, context }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Anfrage fehlgeschlagen");
        }

        const data: QAResult = await res.json();
        setResult(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unbekannter Fehler"
        );
      } finally {
        setLoading(false);
      }
    },
    [record]
  );

  // Handle pre-filled question from URL
  useEffect(() => {
    const q = searchParams.get("q");
    if (q && record) {
      setQuestion(q);
      askQuestion(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, record]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    askQuestion(question);
  }

  function handleChipClick(q: string) {
    setQuestion(q);
    askQuestion(q);
  }

  function findDocId(sourceLabel: string): string | null {
    if (!record) return null;
    const doc = record.documents.find(
      (d) =>
        d.title === sourceLabel ||
        d.title.includes(sourceLabel) ||
        sourceLabel.includes(d.title)
    );
    return doc?.id ?? null;
  }

  if (!record) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-[var(--muted-foreground)]">Lade...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <main className="mx-auto max-w-3xl px-6 py-8 space-y-6">
        <h1 className="text-lg font-semibold text-[var(--foreground)]">
          Fragen &amp; Antworten
        </h1>

        {/* Quick question chips */}
        <div className="flex flex-wrap gap-2">
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => handleChipClick(q)}
              disabled={loading}
              className="rounded-full border border-[var(--border)] bg-[var(--secondary)] px-3.5 py-1.5 text-sm text-[var(--secondary-foreground)] transition-colors hover:border-[var(--primary)] hover:bg-[var(--accent)] hover:text-[var(--primary)] disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input form */}
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Stellen Sie eine Frage zu den Patientendokumenten..."
            className="flex-1 rounded-md border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="inline-flex items-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--primary)]/90 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Fragen
          </button>
        </form>

        {/* Error */}
        {error && (
          <Card className="border-[var(--destructive)]">
            <CardContent className="py-4">
              <p className="text-sm text-[var(--destructive)]">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="flex items-center gap-2 py-4 text-sm text-[var(--muted-foreground)]">
            <Loader2 className="h-4 w-4 animate-spin" />
            Antwort wird generiert...
          </div>
        )}

        {/* Answer */}
        {result && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Antwort</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-relaxed text-[var(--foreground)] whitespace-pre-wrap">
                {result.answer}
              </p>

              {result.sources.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                    Quellen
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.sources.map((src, i) => {
                      const docId = findDocId(src);
                      return (
                        <Badge
                          key={i}
                          variant="outline"
                          className={
                            docId
                              ? "cursor-pointer transition-colors hover:bg-[var(--accent)]"
                              : ""
                          }
                          onClick={() => docId && openSource(docId)}
                        >
                          {src}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>

      {/* Source detail sheet */}
      <SourceDetail />
    </div>
  );
}
