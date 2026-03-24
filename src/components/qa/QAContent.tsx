"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Send, Loader2, Sparkles, MessageCircleQuestion } from "lucide-react";
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
        <div className="flex items-center gap-2.5">
          <MessageCircleQuestion className="h-5 w-5 text-[var(--primary)]" />
          <h1 className="text-lg font-semibold text-[var(--foreground)]">
            Fragen &amp; Antworten
          </h1>
        </div>

        {/* Quick question chips */}
        <div className="flex flex-wrap gap-2">
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => handleChipClick(q)}
              disabled={loading}
              className="rounded-full border border-[var(--border)] bg-[var(--secondary)] px-3.5 py-1.5 text-sm text-[var(--secondary-foreground)] transition-all hover:border-[var(--primary)]/30 hover:bg-[var(--accent)] hover:text-[var(--primary)] hover:shadow-sm disabled:opacity-50"
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
            className="flex-1 rounded-lg border border-[var(--border)] bg-white px-4 py-2.5 text-sm text-[var(--foreground)] shadow-sm placeholder:text-[var(--muted-foreground)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md disabled:opacity-50"
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
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-[var(--destructive)]">
            {error}
          </div>
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="flex items-center gap-3 rounded-lg bg-[var(--accent)] px-5 py-4 text-sm text-[var(--primary)] animate-pulse-soft">
            <Loader2 className="h-4 w-4 animate-spin" />
            Antwort wird generiert...
          </div>
        )}

        {/* Answer -- chat-like bubble */}
        {result && (
          <div className="animate-slide-up space-y-4">
            {/* Answer bubble */}
            <div className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--primary)] text-white">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Antwort
                </span>
              </div>
              <p className="text-[15px] leading-[1.7] text-[var(--foreground)] whitespace-pre-wrap">
                {result.answer}
              </p>

              {result.sources.length > 0 && (
                <div className="mt-5 pt-4 border-t border-[var(--border)]">
                  <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
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
                              ? "cursor-pointer transition-all hover:bg-[var(--accent)] hover:border-[var(--primary)]/30 hover:shadow-sm"
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
            </div>
          </div>
        )}
      </main>

      {/* Source detail sheet */}
      <SourceDetail />
    </div>
  );
}
