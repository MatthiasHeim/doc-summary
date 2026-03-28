"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, ExternalLink, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";

const CONSENT_KEY = "doc-summary-consent-accepted";

export function ConsentGate({ children }: { children: React.ReactNode }) {
  const [accepted, setAccepted] = useState<boolean | null>(null);

  useEffect(() => {
    setAccepted(sessionStorage.getItem(CONSENT_KEY) === "true");
  }, []);

  function handleAccept() {
    sessionStorage.setItem(CONSENT_KEY, "true");
    setAccepted(true);
  }

  // Avoid flash: render nothing until we know the consent state
  if (accepted === null) return null;
  if (accepted) return <>{children}</>;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--foreground)]/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl animate-slide-up">
        {/* Header band */}
        <div className="flex items-center gap-3 rounded-t-2xl bg-amber-50 border-b border-amber-200 px-6 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--foreground)]">
              Prototyp-Hinweis
            </h2>
            <p className="text-xs text-amber-700 font-medium">
              Bitte vor der Nutzung lesen
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 text-[14.5px] leading-relaxed text-[var(--foreground)]">
          <div className="flex items-start gap-3 rounded-lg bg-[var(--secondary)] p-3.5">
            <FlaskConical className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[var(--primary)]" />
            <p>
              Diese Anwendung ist ein <strong>Prototyp</strong> und kein
              Produktivsystem. Sie dient ausschliesslich zu
              Demonstrationszwecken.
            </p>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-[var(--secondary)] p-3.5">
            <ExternalLink className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[var(--primary)]" />
            <p>
              Hochgeladene Dokumente werden zur Verarbeitung an{" "}
              <strong>OpenAI</strong> (externer Anbieter, USA) gesendet. Die
              Daten verlassen die Schweiz.
            </p>
          </div>

          <div className="rounded-lg border-2 border-red-200 bg-red-50 p-3.5">
            <p className="font-semibold text-red-800">
              Keine echten Patientendaten hochladen.
            </p>
            <p className="mt-1 text-[13.5px] text-red-700">
              Verwenden Sie ausschliesslich Testdaten oder anonymisierte
              Dokumente. Das Hochladen von personenbezogenen
              Gesundheitsdaten oder anderen sensiblen Informationen ist
              untersagt.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--border)] px-6 py-4">
          <Button
            size="lg"
            className="w-full rounded-lg py-3 text-[15px] font-semibold shadow-md shadow-[var(--primary)]/10 transition-all hover:shadow-lg hover:shadow-[var(--primary)]/15"
            onClick={handleAccept}
          >
            Verstanden &mdash; weiter zum Prototyp
          </Button>
          <p className="mt-3 text-center text-xs text-[var(--muted-foreground)]">
            Mit Klick bestätigen Sie, dass Sie die oben genannten
            Einschränkungen zur Kenntnis genommen haben.
          </p>
        </div>
      </div>
    </div>
  );
}
