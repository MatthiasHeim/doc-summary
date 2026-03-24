# Patientenübersicht Prototyp — Fortschritt

## Phase 0: Projekt-Setup & Grundstruktur
- [x] **0.1** Next.js Projekt initialisieren (TypeScript, Tailwind, App Router)
- [x] **0.2** shadcn/ui installieren und konfigurieren
- [x] **0.3** Zusätzliche Dependencies installieren (Recharts, Lucide, react-dropzone, openai, pdf-parse, mammoth)
- [x] **0.4** Projektstruktur und Layout-Shell aufsetzen
- [x] **0.5** TypeScript-Typen gemäss Spec JSON-Schema definieren

## Phase 1: GitHub, CI/CD & Railway Deployment
- [x] **1.1** Git initialisieren, `.gitignore` erstellen
- [x] **1.2** GitHub Repository erstellen (MatthiasHeim/doc-summary)
- [x] **1.3** Vitest + Playwright als Test-Dependencies installieren und konfigurieren
- [x] **1.4** Railway Projekt erstellen, Service + Domain konfigurieren
- [x] **1.5** Erster Deploy auf Railway
- [x] **1.6** Production-URL verifizieren (https://doc-summary-production.up.railway.app)

## Phase 2: Testdaten & Datenzugriffsschicht
- [x] **2.1** Testdaten aus `test_data/` inventarisieren (3 PDF, 2 DOCX, 1 DOC)
- [x] **2.2** Textextraktion für PDF implementieren (`pdf-parse`)
- [x] **2.3** Textextraktion für DOCX/DOC implementieren (`mammoth`)
- [x] **2.4** Datenzugriffsschicht (`lib/data.ts`) aufbauen
- [x] **2.5** Unit Tests: Textextraktion PDF + Word (20 Tests passing)
- [x] **2.6** Deploy & verifizieren

## Phase 3: Upload-Screen (Screen A)
- [x] **3.1** Upload-Zone Komponente (Drag & Drop, akzeptiert PDF + Word)
- [x] **3.2** Dateiliste Komponente mit Statusanzeige
- [x] **3.3** Landing Page zusammenbauen
- [x] **3.4** Upload State Management (React Context)
- [x] **3.5** Unit Tests: Upload-Komponenten (15 Tests)
- [x] **3.6** Deploy & verifizieren

## Phase 4: Verarbeitungs-Pipeline & Status-Screen (Screen B)
- [x] **4.1** API Route: Dokumenten-Upload + Textextraktion (PDF + Word)
- [x] **4.2** API Route: GPT-4.1 Analyse → strukturiertes JSON
- [x] **4.3** API Route: Q&A Endpoint
- [x] **4.4** Verarbeitungsstatus-Screen mit Fortschrittsanzeige
- [x] **4.5** Upload-to-Processing Flow verdrahten
- [x] **4.6** Unit Tests: API Routes (extract)
- [x] **4.7** Deploy & verifizieren

## Phase 5: Patientenübersicht Dashboard (Screen C)
- [x] **5.1** Patienten-Header Komponente
- [x] **5.2** Executive Summary Komponente
- [x] **5.3** Diagnoseliste Komponente
- [x] **5.4** Timeline Komponente
- [x] **5.5** Dashboard-Seite zusammenbauen (2-Spalten-Layout)
- [x] **5.6** Unit Tests: Dashboard-Komponenten (28 Tests)
- [x] **5.7** Deploy & verifizieren

## Phase 6: Laborwert-Visualisierung
- [x] **6.1** Labor-Chart Komponente (Recharts LineChart)
- [x] **6.2** Labor-Selektor Komponente (Dropdown)
- [x] **6.3** Labor-Sektion ins Dashboard integrieren
- [x] **6.4** Unit Tests: Chart + Selektor (3 Tests)
- [x] **6.5** Deploy & verifizieren

## Phase 7: Q&A-Komponente (Screen D)
- [x] **7.1** Q&A Eingabe-Komponente mit Vorschlagsfragen
- [x] **7.2** Q&A Antwort-Komponente mit Quellenverweisen
- [x] **7.3** Q&A-Seite aufbauen
- [x] **7.4** Quick Questions Widget ins Dashboard
- [x] **7.5** Unit Tests: Q&A-Komponenten (6 Tests)
- [x] **7.6** Deploy & verifizieren

## Phase 8: Quellennachvollziehbarkeit & Dokumentenansicht (Screen E)
- [x] **8.1** Dokumentenliste Seite
- [x] **8.2** Quellendetail Sheet/Modal
- [x] **8.3** Quellenverweise app-weit verdrahten (Diagnosen, Timeline, Charts, Q&A)
- [x] **8.4** Dokumentensektion ins Dashboard
- [x] **8.5** Unit Tests: Dokumenten-Komponenten (7 Tests)
- [x] **8.6** Deploy & verifizieren

## Phase 9: E2E Tests & Feinschliff
- [ ] **9.1** Playwright E2E: Upload-Seite lädt korrekt
- [ ] **9.2** Playwright E2E: Navigation funktioniert
- [ ] **9.3** Playwright E2E: Datei-Upload Interaktion
- [x] **9.4** Visueller Feinschliff (Spacing, Typografie, klinische Ästhetik)
- [x] **9.5** Ladezustände und Übergänge
- [ ] **9.6** Deploy & verifizieren

## Phase 10: Production-Verifikation
- [ ] **10.1** Alle E2E Tests gegen Production-URL laufen lassen
- [ ] **10.2** Manueller Walkthrough: Flow 1 (Happy Path) auf Production
- [ ] **10.3** Manueller Walkthrough: Flow 2 (Labor-Fokus) auf Production
- [ ] **10.4** Manueller Walkthrough: Flow 3 (Diagnose-Fokus) auf Production
- [ ] **10.5** Teilbare URL dokumentieren und bestätigen
