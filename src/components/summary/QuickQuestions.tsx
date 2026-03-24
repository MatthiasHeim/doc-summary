"use client";

import { useRouter } from "next/navigation";
import { MessageCircleQuestion, ArrowRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

const QUESTIONS = [
  "Diagnosen der letzten 5 Jahre",
  "Wichtige Spitalaufenthalte",
  "PSA-Verlauf",
  "Kardiologische Ereignisse",
  "Aktuelle Medikation",
];

export function QuickQuestions() {
  const router = useRouter();

  function handleClick(question: string) {
    router.push(`/qa?q=${encodeURIComponent(question)}`);
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MessageCircleQuestion className="h-5 w-5 text-[var(--primary)]" />
          Schnellfragen
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => handleClick(q)}
              className="group inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--secondary)] px-3.5 py-1.5 text-sm text-[var(--secondary-foreground)] transition-all hover:border-[var(--primary)]/30 hover:bg-[var(--accent)] hover:text-[var(--primary)] hover:shadow-sm"
            >
              {q}
              <ArrowRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" />
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
