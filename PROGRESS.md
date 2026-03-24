# Patientenübersicht Prototyp — Fortschritt

## Phase 0: Projekt-Setup & Grundstruktur
- [x] **0.1** Next.js Projekt initialisieren (TypeScript, Tailwind, App Router)
- [x] **0.2** shadcn/ui installieren und konfigurieren
- [x] **0.3** Zusätzliche Dependencies installieren (Recharts, Lucide, react-dropzone, openai, pdf-parse, mammoth)
- [x] **0.4** Projektstruktur und Layout-Shell aufsetzen
- [x] **0.5** TypeScript-Typen gemäss Spec JSON-Schema definieren

## Phase 1: GitHub, CI/CD & Railway Deployment
- [ ] **1.1** Git initialisieren, `.gitignore` erstellen
- [ ] **1.2** GitHub Repository erstellen (via `gh`)
- [ ] **1.3** Vitest + Playwright als Test-Dependencies installieren und konfigurieren
- [ ] **1.4** Railway Projekt erstellen und mit GitHub verknüpfen
- [ ] **1.5** Erster Deploy: leere App auf Railway live
- [ ] **1.6** Production-URL verifizieren (App lädt im Browser)

## Phase 2: Testdaten & Datenzugriffsschicht
- [ ] **2.1** Testdaten aus `test_data/` inventarisieren (3 PDF, 2 DOCX, 1 DOC)
- [ ] **2.2** Textextraktion für PDF implementieren (`pdf-parse`)
- [ ] **2.3** Textextraktion für DOCX/DOC implementieren (`mammoth`)
- [ ] **2.4** Datenzugriffsschicht (`lib/data.ts`) aufbauen
- [ ] **2.5** Unit Tests: Textextraktion PDF + Word
- [ ] **2.6** Deploy & verifizieren

## Phase 3: Upload-Screen (Screen A)
- [ ] **3.1** Upload-Zone Komponente (Drag & Drop, akzeptiert PDF + Word)
- [ ] **3.2** Dateiliste Komponente mit Statusanzeige
- [ ] **3.3** Landing Page zusammenbauen
- [ ] **3.4** Upload State Management (Context/Store)
- [ ] **3.5** Unit Tests: Upload-Komponenten
- [ ] **3.6** Deploy & verifizieren

## Phase 4: Verarbeitungs-Pipeline & Status-Screen (Screen B)
- [ ] **4.1** API Route: Dokumenten-Upload + Textextraktion (PDF + Word)
- [ ] **4.2** API Route: GPT-4.1 Analyse → strukturiertes JSON
- [ ] **4.3** API Route: Q&A Endpoint
- [ ] **4.4** Verarbeitungsstatus-Screen mit Fortschrittsanzeige
- [ ] **4.5** Upload-to-Processing Flow verdrahten
- [ ] **4.6** Unit Tests: alle API Routes
- [ ] **4.7** Deploy & verifizieren (Upload + Verarbeitung funktioniert auf Production)

## Phase 5: Patientenübersicht Dashboard (Screen C)
- [ ] **5.1** Patienten-Header Komponente
- [ ] **5.2** Executive Summary Komponente
- [ ] **5.3** Diagnoseliste Komponente
- [ ] **5.4** Timeline Komponente
- [ ] **5.5** Dashboard-Seite zusammenbauen (2-Spalten-Layout)
- [ ] **5.6** Unit Tests: Dashboard-Komponenten
- [ ] **5.7** Deploy & verifizieren

## Phase 6: Laborwert-Visualisierung
- [ ] **6.1** Labor-Chart Komponente (Recharts LineChart)
- [ ] **6.2** Labor-Selektor Komponente (Dropdown)
- [ ] **6.3** Labor-Sektion ins Dashboard integrieren
- [ ] **6.4** Unit Tests: Chart + Selektor
- [ ] **6.5** Deploy & verifizieren

## Phase 7: Q&A-Komponente (Screen D)
- [ ] **7.1** Q&A Eingabe-Komponente mit Vorschlagsfragen
- [ ] **7.2** Q&A Antwort-Komponente mit Quellenverweisen
- [ ] **7.3** Q&A-Seite aufbauen
- [ ] **7.4** Quick Questions Widget ins Dashboard
- [ ] **7.5** Unit Tests: Q&A-Komponenten
- [ ] **7.6** Deploy & verifizieren

## Phase 8: Quellennachvollziehbarkeit & Dokumentenansicht (Screen E)
- [ ] **8.1** Dokumentenliste Seite
- [ ] **8.2** Quellendetail Sheet/Modal
- [ ] **8.3** Quellenverweise app-weit verdrahten (Diagnosen, Timeline, Charts, Q&A)
- [ ] **8.4** Dokumentensektion ins Dashboard
- [ ] **8.5** Unit Tests: Dokumenten-Komponenten
- [ ] **8.6** Deploy & verifizieren

## Phase 9: E2E Tests & Feinschliff
- [ ] **9.1** Playwright E2E: Upload → Verarbeitung → Summary Flow
- [ ] **9.2** Playwright E2E: Labor-Chart Interaktion
- [ ] **9.3** Playwright E2E: Q&A Flow
- [ ] **9.4** Playwright E2E: Quellenansicht Navigation
- [ ] **9.5** Visueller Feinschliff (Spacing, Typografie, klinische Ästhetik)
- [ ] **9.6** Ladezustände und Übergänge
- [ ] **9.7** Fehlerbehandlung und Fallback-Logik
- [ ] **9.8** Deploy & verifizieren

## Phase 10: Production-Verifikation
- [ ] **10.1** Alle E2E Tests gegen Production-URL laufen lassen
- [ ] **10.2** Manueller Walkthrough: Flow 1 (Happy Path) auf Production
- [ ] **10.3** Manueller Walkthrough: Flow 2 (Labor-Fokus) auf Production
- [ ] **10.4** Manueller Walkthrough: Flow 3 (Diagnose-Fokus) auf Production
- [ ] **10.5** Teilbare URL dokumentieren und bestätigen
