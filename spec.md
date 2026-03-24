Spezifikationsdokument: KI-gestuetzte Patientenuebersicht aus Krankengeschichten

1. Ziel des Prototyps

Dieser Prototyp soll das UX-Konzept, den User Flow und das Produktpotenzial eines webbasierten Tools zeigen, das unstrukturierte medizinische Dokumente in eine schnelle, nutzbare Patientenuebersicht ueberfuehrt.

Der Prototyp ist kein produktionsreifes MedTech-System, sondern ein High-Fidelity-Demonstrator fuer interne Teams, potenzielle Pilotkunden und Stakeholder.

Hauptziel

Aerzten in kurzer Zeit einen strukturierten Ueberblick ueber die relevanten Inhalte einer Krankengeschichte geben, insbesondere bei Patienten, die sie zum ersten Mal sehen.

Was der Prototyp demonstrieren soll
	•	Upload von medizinischen Dokumenten als PDF oder Scan
	•	Verarbeitung unstrukturierter Inhalte mit KI
	•	Generierung einer strukturierten Patientenuebersicht
	•	Extraktion relevanter Diagnosen, Laborwerte, Zeitverlaeufe und Dokumentquellen
	•	Beantwortung gezielter Fragen zur Krankengeschichte
	•	Visualisierung von Laborwertverlaeufen
	•	Nachvollziehbarkeit durch Quellenangaben auf Dokumentebene

Was der Prototyp explizit noch nicht leisten muss
	•	produktionsreife Sicherheit
	•	Integration in Praxissoftware
	•	Schnittstellen zu KIS / PIS / EPD
	•	Benutzerrollen und Rechteverwaltung
	•	regulatorische Vollstaendigkeit
	•	Abrechnung, Audit-Log, Mandantenfaehigkeit

⸻

2. Produktvision

Das Tool loest ein haeufiges Problem im medizinischen Alltag:
AErzte haben oft zu wenig Zeit, um lange und unstrukturierte Krankengeschichten manuell zu durchsuchen. Besonders in groesseren medizinischen Zentren oder Gruppenpraxen fehlt haeufig die persoenliche Langzeitkenntnis zum Patienten.

Das Tool soll daher aus vielen Dokumenten eine kompakte, klinisch brauchbare Uebersicht generieren.

Kernnutzen
	•	weniger Suchaufwand
	•	schnelleres Verstehen komplexer Verlaeufe
	•	bessere Vorbereitung vor Konsultationen
	•	rascher Zugriff auf relevante Diagnosen, Laborverlaeufe und externe Berichte

⸻

3. Zielgruppe

Primaere Zielgruppe
	•	Aerzte in groesseren ambulanten medizinischen Zentren
	•	Hausaerzte in Gruppenpraxen
	•	AErzte, die Patienten nicht seit Jahren persoenlich kennen

Sekundaere Zielgruppe
	•	medizinische Praxisassistenz oder interne Teammitglieder, die Dossiers vorbereiten
	•	Produkt- und Innovationsteams, die das Potenzial der Loesung beurteilen wollen

⸻

4. Produktformat

Typ

Eigenstaendiges, webbasiertes Tool

Sprache

Deutsch

Nutzung im Prototyp
	•	Dokumente werden manuell hochgeladen
	•	Mock-Daten werden verwendet
	•	Verarbeitung kann simuliert oder teilweise echt umgesetzt werden
	•	Ausgabe erfolgt in einer klaren, visuell hochwertigen Weboberflaeche

⸻

5. Eingabedaten

Der Prototyp soll mit unstrukturierten medizinischen Dokumenten arbeiten.

Unterstuetzte Input-Typen
	•	PDF-Dateien
	•	gescannte PDFs
	•	Word-Dokumente (.docx)
	•	Aeltere Word-Dokumente (.doc)
	•	mehrseitige Arztberichte
	•	Austrittsberichte
	•	Spitalberichte
	•	Facharztberichte
	•	Laborberichte
	•	Freitextdokumente

Technische Umsetzung Textextraktion
	•	PDF: pdf-parse (nativ) + OCR fuer gescannte Dokumente
	•	DOCX/DOC: mammoth (Node.js Library)

Annahmen fuer den Prototyp
	•	OCR darf verwendet werden, falls Dokumente gescannt sind
	•	Input kann teilweise verrauscht, unvollstaendig oder uneinheitlich sein
	•	Dokumente muessen nicht normiert sein
	•	Es gibt zunaechst keinen direkten Zugriff auf Praxissoftware
	•	Upload ist der initiale Einstiegspunkt

Testdaten (test_data/)

Sechs reale medizinische Dokumente stehen als Testdaten zur Verfuegung:
	•	Spitalbericht_Meier_Waltraud_1929.pdf
	•	Spital_Pflanzschule_Hunziker_Beeke.pdf
	•	KSGR an Geiselweid.pdf
	•	Preprod Geiselweid.docx
	•	Preprod Dinkelacker .docx
	•	Austrittsbericht AN PRAXIS AM GEISELWEID Mail.doc

Beispielhafte Dokumentarten
	•	hausarztinterne Verlaufsnotizen
	•	externe Konsiliarberichte
	•	Diagnoselisten in Freitext
	•	Laborreports mit Tabellen
	•	radiologische Befunde
	•	Spitalaustrittsberichte

⸻

6. Kern-Use-Cases

Use Case 1: Neuer Patient vor Konsultation

Ein Arzt oeffnet das Tool, laedt vorhandene Dokumente hoch und erhaelt innert kurzer Zeit eine kompakte Uebersicht ueber die wichtigsten medizinischen Entwicklungen der letzten Jahre.

Use Case 2: Rascher Laborwert-Ueberblick

Ein Arzt fragt: “Zeig mir den PSA-Verlauf der letzten 2 Jahre” oder “Wie haben sich die HbA1c-Werte entwickelt?” und sieht eine Zeitreihe mit Quellenbezug.

Use Case 3: Diagnosen zusammenfassen

Das Tool erstellt eine Liste relevanter Diagnosen inklusive Datum, Quelle und wer die Diagnose gestellt hat, soweit im Text erkennbar.

Use Case 4: Schnelle Rueckfrage an die KG

Der Nutzer stellt eine gezielte Frage in natuerlicher Sprache, z.B.:
	•	“Wann wurde erstmals Diabetes erwaehnt?”
	•	“Welche kardiologischen Abklaerungen gab es in den letzten 3 Jahren?”
	•	“Gab es Hinweise auf Prostatakarzinom?”

Use Case 5: Verlauf verstehen

Das Tool ordnet Ereignisse chronologisch und macht so den klinischen Verlauf schneller erfassbar.

⸻

7. Funktionsumfang des Prototyps

7.1 Must-have Funktionen

A. Dokument-Upload
	•	Upload mehrerer Dokumente
	•	Anzeige der hochgeladenen Dateien in einer Liste
	•	Statusanzeige pro Dokument, z.B. hochgeladen, wird verarbeitet, verarbeitet

B. KI-Verarbeitung
	•	Dokumente werden in Text ueberfuehrt
	•	Inhalte werden durch GPT-4.1 analysiert
	•	Ein strukturiertes JSON wird erzeugt
	•	Mehrere Dokumente werden zu einem Patientenkontext zusammengefuehrt

C. Patientenuebersicht
Eine zentrale Uebersichtsseite zeigt mindestens:
	•	Kurz-Zusammenfassung des Patientenverlaufs
	•	wichtigste Diagnosen
	•	relevante Laborwerte und Trends
	•	zentrale medizinische Ereignisse
	•	verarbeitete Dokumentquellen

D. Frage-Antwort-Funktion
	•	Textfeld fuer Freitextfragen
	•	Antworten auf Basis der hochgeladenen Dokumente
	•	Antwort soll Quellen referenzieren

E. Visualisierung von Laborwerten
	•	Auswahl einzelner Laborparameter
	•	Zeitliche Darstellung in Chart-Form
	•	Anzeige von Datum, Wert und Quelle

F. Quellenbezug / Nachvollziehbarkeit
	•	jede Zusammenfassungseinheit soll auf Ursprungsdokumente verweisen
	•	Nutzer soll erkennen, aus welchem Dokument eine Information stammt

7.2 Nice-to-have Funktionen
	•	Filter nach Zeitraum, z.B. letzte 2 Jahre, letzte 5 Jahre
	•	Filter nach Dokumenttyp
	•	Markierung von Unsicherheiten, z.B. “wahrscheinlich”, “nicht eindeutig”
	•	Expand/Collapse fuer detaillierte Textpassagen
	•	Vorschlagsfragen, die mit einem Klick ausgeloest werden koennen

⸻

8. Nicht-Ziele fuer Version 1 des Prototyps

Diese Elemente gehoeren nicht in den ersten Umsetzungsumfang:
	•	Login / Auth / Benutzerverwaltung
	•	produktionsreife Datenschutz- oder Hosting-Architektur
	•	Anbindung an echte Patientensysteme
	•	Schreibzugriff in Fremdsysteme
	•	medizinische Entscheidungsunterstuetzung mit Therapieempfehlungen
	•	automatische Validierung gegen Leitlinien
	•	Kodierung nach ICD / TARMED / DRG

⸻

9. UX-Prinzipien

Der Prototyp soll visuell hochwertig, ruhig und klinisch brauchbar wirken.

UX-Ziele
	•	schnelle Orientierung
	•	minimale kognitive Last
	•	vertrauenswuerdige Informationsdarstellung
	•	gute Scanbarkeit
	•	klare Hierarchie
	•	wenige, starke Hauptaktionen

Gestaltungsprinzipien
	•	ein klarer Primary Flow
	•	Fokus auf Uebersicht statt Datenflut
	•	wichtige Infos above the fold
	•	chronologische und semantische Gruppierung
	•	Quellen immer sichtbar oder leicht auffindbar
	•	Charts und Summary muessen sofort lesbar sein

Tonalitaet der UI
	•	sachlich
	•	praezise
	•	medizinisch serioes
	•	nicht verspielt

⸻

10. Empfohlene Informationsarchitektur

Hauptscreens
	1.	Landing / Upload Screen
	2.	Verarbeitungsstatus Screen
	3.	Patient Summary Dashboard
	4.	Detailansicht Dokumente / Quellen
	5.	Q&A Screen oder eingebettetes Ask-Modul

Navigationslogik

Fuer den Prototyp reicht eine sehr einfache Navigation:
	•	Upload
	•	Uebersicht
	•	Fragen
	•	Dokumente

Optional koennen diese auch als Tabs auf einer einzigen Detailseite umgesetzt werden.

⸻

11. Empfohlener User Flow

Flow 1: Happy Path
	1.	Nutzer oeffnet das Tool
	2.	Nutzer laedt mehrere PDFs oder Scans hoch
	3.	Tool zeigt Upload-Liste und Processing-Status
	4.	Nach Verarbeitung gelangt Nutzer automatisch zur Patientenuebersicht
	5.	Nutzer sieht auf einen Blick:
	•	Kurzsummary
	•	Diagnosen
	•	Laborverlauf
	•	wichtige Ereignisse
	6.	Nutzer klickt auf eine Diagnose oder einen Laborwert
	7.	Tool zeigt Quelle und Kontext
	8.	Nutzer stellt eine Rueckfrage im Ask-Feld
	9.	Tool antwortet mit Bezug auf Dokumente

Flow 2: Labor-Fokus
	1.	Nutzer ist auf Summary-Seite
	2.	Nutzer waehlt einen Parameter, z.B. PSA
	3.	Tool zeigt Verlauf als Chart
	4.	Nutzer kann Datenpunkte anklicken
	5.	Tool zeigt Datum, Wert, Einheit und Quelldokument

Flow 3: Diagnose-Fokus
	1.	Nutzer oeffnet Diagnosen-Modul
	2.	Tool zeigt Diagnosen mit Datum, Quelle, ggf. diagnostizierende Stelle
	3.	Nutzer klickt auf einen Eintrag
	4.	Originaltext oder Dokumentkontext wird sichtbar

⸻

12. Screen-by-Screen Spezifikation

12.1 Screen A: Landing / Upload

Ziel

Nutzer soll sofort verstehen, was das Tool macht, und Dokumente hochladen koennen.

Inhalte
	•	Titel, z.B. “Patientenakte intelligent zusammenfassen”
	•	kurzer Untertitel
	•	Drag-and-drop Upload-Flaeche
	•	Button “Dateien auswaehlen”
	•	Liste der hochgeladenen Dateien
	•	Primary CTA: “Verarbeitung starten”

Komponenten
	•	Header
	•	Upload Zone
	•	File List
	•	CTA Button

UX-Hinweise
	•	akzeptierte Formate sichtbar machen
	•	Mehrfachupload unterstuetzen
	•	Dateinamen und Seitenzahl optional anzeigen

⸻

12.2 Screen B: Verarbeitungsstatus

Ziel

Nutzer versteht, dass die Dokumente analysiert werden.

Inhalte
	•	Processing State mit Fortschrittsanzeige
	•	Liste der Dokumente mit Einzelstatus
	•	kurze textliche Beschreibung, z.B.:
	•	OCR wird ausgefuehrt
	•	Inhalte werden strukturiert
	•	Patientenuebersicht wird erstellt

Komponenten
	•	Progress Indicator
	•	File Processing Cards
	•	Loader / Skeleton fuer spaetere Inhalte

UX-Hinweise
	•	fuer Demo-Zwecke darf der Status auch simuliert werden
	•	visuell ruhig halten

⸻

12.3 Screen C: Patient Summary Dashboard

Ziel

Dies ist der wichtigste Screen des gesamten Prototyps. Er muss das Potenzial sofort sichtbar machen.

Layout-Vorschlag

Zweispaltig oder dreiteilig:

Oberer Bereich
	•	Patientenname als Mock
	•	Zeitraum der analysierten Dokumente
	•	Anzahl Dokumente
	•	Letztes Update

Hauptbereich links
	•	Executive Summary
	•	Diagnosen
	•	wichtige Ereignisse / Timeline

Hauptbereich rechts
	•	Laborwerte / Trend-Chart
	•	Quick Questions
	•	Quellen / Dokumente

Module im Detail

A. Executive Summary
Kurztext mit 5 bis 10 Saetzen:
	•	wichtigste Krankheitsbilder
	•	relevante Verlaeufe
	•	grosse Ereignisse
	•	auffaellige Laborentwicklungen

B. Diagnosen-Block
Tabellarisch oder als strukturierte Liste:
	•	Diagnose
	•	erster / relevanter Zeitpunkt
	•	diagnostizierende Stelle oder Quelle
	•	Status optional, z.B. aktiv, historisch, Verdacht

C. Timeline wichtiger Ereignisse
Chronologisch sortierte Cards oder Listeneintraege:
	•	Datum
	•	Ereignis
	•	Dokumentquelle

Beispiele:
	•	Hospitalisation wegen Thoraxschmerz
	•	Erstdiagnose Diabetes mellitus Typ 2
	•	Urologische Abklaerung bei erhoehtem PSA

D. Labor-Visualisierung
	•	Dropdown fuer Messparameter
	•	Liniendiagramm
	•	Datenpunkte mit Tooltip
	•	moeglichst klare Lesbarkeit

E. Quick Questions
Vordefinierte Buttons, z.B.:
	•	Diagnosen der letzten 5 Jahre
	•	wichtige Spitalaufenthalte
	•	PSA-Verlauf
	•	kardiologische Ereignisse

F. Dokumentquellen
Liste der verarbeiteten Dokumente:
	•	Titel
	•	Datum
	•	Typ
	•	Button “anzeigen”

⸻

12.4 Screen D: Q&A / Ask the record

Ziel

Erlaubt gezielte Rueckfragen an die Krankengeschichte.

Inhalte
	•	Eingabefeld fuer Freitextfrage
	•	Antwortbereich
	•	Quellenhinweise
	•	optionale Folgefragen

Beispiel-Fragen
	•	“Fasse die kardiologischen Ereignisse der letzten 3 Jahre zusammen”
	•	“Welche Diagnosen wurden vom Spital gestellt?”
	•	“Wie hat sich der PSA-Wert entwickelt?”
	•	“Gab es Hinweise auf chronische Niereninsuffizienz?”

Erwartete Antwortstruktur
	•	kurze klare Antwort
	•	ggf. Bullet-Liste von Befunden
	•	Quellenverweise auf Dokumente

UX-Hinweise
	•	Antworten sollen kompakt sein
	•	Quellen muessen klickbar oder sichtbar sein
	•	Unsicherheit transparent markieren

⸻

12.5 Screen E: Dokumentdetail / Quellenansicht

Ziel

Vertrauen schaffen durch Nachvollziehbarkeit.

Inhalte
	•	Liste aller Dokumente
	•	Vorschau oder Textauszug
	•	hervorgehobene relevante Stellen
	•	Metadaten, z.B. Datum, Typ, Quelle

UX-Hinweise
	•	fuer Prototyp reicht Side Panel oder Modal
	•	kein vollstaendiger PDF-Viewer zwingend noetig
	•	entscheidend ist, dass Nutzer versteht, woher die Information stammt

⸻

13. Datenmodell fuer den Prototyp

Der Prototyp soll idealerweise ein JSON erzeugen, das von der UI direkt verwendet werden kann.

Ziel des JSON
	•	Trennung zwischen KI-Extraktion und Frontend-Darstellung
	•	einfaches Mocking und Testen
	•	Grundlage fuer spaetere API-Architektur

Vorschlag fuer JSON-Struktur

{
  "patient": {
    "id": "mock-001",
    "name": "Max Muster",
    "date_of_birth": "1968-04-11",
    "document_count": 12,
    "analysis_period": {
      "from": "2021-01-01",
      "to": "2025-12-31"
    }
  },
  "summary": {
    "executive_summary": "...",
    "key_takeaways": [
      "...",
      "..."
    ]
  },
  "diagnoses": [
    {
      "label": "Diabetes mellitus Typ 2",
      "date": "2022-03-10",
      "source_document_id": "doc-03",
      "source_label": "Hausarztbericht 10.03.2022",
      "diagnosed_by": "Hausarztpraxis Zentrum Nord",
      "status": "active",
      "confidence": "high"
    }
  ],
  "lab_values": [
    {
      "parameter": "PSA",
      "unit": "ug/L",
      "values": [
        {
          "date": "2023-05-12",
          "value": 3.2,
          "source_document_id": "doc-07",
          "source_label": "Laborbericht 12.05.2023"
        },
        {
          "date": "2024-11-04",
          "value": 4.8,
          "source_document_id": "doc-11",
          "source_label": "Laborbericht 04.11.2024"
        }
      ]
    }
  ],
  "events": [
    {
      "date": "2024-01-18",
      "title": "Urologische Abklaerung bei erhoehtem PSA",
      "description": "...",
      "source_document_id": "doc-08",
      "source_label": "Urologie Bericht 18.01.2024",
      "category": "specialist_visit"
    }
  ],
  "documents": [
    {
      "id": "doc-08",
      "title": "Urologie Bericht 18.01.2024",
      "date": "2024-01-18",
      "type": "specialist_report",
      "origin": "Urologie Zentrum",
      "pages": 3,
      "text_excerpt": "..."
    }
  ],
  "qa_examples": [
    {
      "question": "Zeig mir den PSA-Verlauf der letzten 2 Jahre",
      "answer": "...",
      "sources": ["doc-07", "doc-11"]
    }
  ]
}

Hinweise
	•	confidence kann fuer Demo hilfreich sein
	•	source_document_id ist zentral fuer Traceability
	•	lab_values.values sollte chart-ready sein
	•	events soll Timeline-ready sein

⸻

14. KI-Logik und Verarbeitung

Modell

GPT-4.1

Erwartete KI-Aufgaben
	1.	OCR-Text oder PDF-Text einlesen
	2.	relevante medizinische Informationen extrahieren
	3.	Diagnosen identifizieren
	4.	Laborwerte mit Datum und Einheit extrahieren
	5.	wichtige Ereignisse chronologisch ordnen
	6.	Executive Summary erstellen
	7.	strukturierte JSON-Ausgabe erzeugen
	8.	Antworten auf Rueckfragen generieren

KI-Ausgabeprinzipien
	•	moeglichst strukturierte Outputs
	•	keine freien langen Monologe als Primarformat
	•	alle Kernaussagen sollen auf Dokumentquellen referenzierbar sein
	•	Unsicherheit transparent machen

Prompting-Empfehlung

Die KI sollte angewiesen werden:
	•	nur Informationen aus den Dokumenten zu verwenden
	•	keine Fakten zu erfinden
	•	Diagnosen, Laborwerte und Ereignisse getrennt auszugeben
	•	Datumsangaben zu normalisieren
	•	Quellen mitzugeben
	•	bei Unklarheit “nicht eindeutig aus Dokumenten ersichtlich” zu markieren

⸻

15. Technische Umsetzungslogik auf hoher Ebene

Empfohlene Architektur fuer Prototyp

Frontend
	•	React / Next.js
	•	High-Fidelity UI
	•	Chart Library fuer Laborverlaeufe

Backend
	•	einfacher API-Layer
	•	File Upload Handling
	•	OCR Layer fuer Scans
	•	LLM Processing Pipeline
	•	JSON Output fuer Frontend

Pipeline
	1.	Upload (PDF, DOCX, DOC)
	2.	Formatspezifische Text-Extraktion (pdf-parse fuer PDF, mammoth fuer Word)
	3.	OCR falls gescannte PDF
	4.	Chunking oder Dokumentvorverarbeitung
	5.	GPT-4.1 Analyse
	6.	JSON-Normalisierung
	7.	Rendering im Frontend

Qualitaetssicherung
	•	Unit Tests fuer alle Komponenten und API-Routen (Vitest)
	•	End-to-End Tests fuer alle User Flows (Playwright)
	•	Tests werden mit jeder Feature-Phase geschrieben

Deployment
	•	GitHub Repository als Source of Truth
	•	Railway fuer Production Hosting
	•	Automatisches Deployment bei Push auf main
	•	Ziel: teilbare Production-URL

Moegliche technische Vereinfachung fuer den Prototyp

Um schneller zu sein, darf ein Teil der Pipeline gemockt werden:
	•	Upload ist echt
	•	bestimmte Resultate kommen aus vorbereiteten Mock-JSONs
	•	Q&A kann auf vorbereiteten Beispielen basieren
	•	Charts koennen auf extrahierten oder manuell kuratierten Daten basieren

⸻

16. Anforderungen an das Frontend

Visueller Anspruch
	•	modern
	•	professionell
	•	ruhig
	•	medizinisch serioes
	•	gut praesentierbar gegenueber Kunden

Wichtige UI-Komponenten
	•	File Upload Area
	•	Status Cards
	•	Summary Panel
	•	Diagnose List
	•	Timeline
	•	Chart
	•	Ask Input
	•	Source Drawer / Modal

Responsive Verhalten

Desktop-first. Mobile Optimierung ist fuer den Prototyp nicht prioritaer.

Design-Prioritaet

Ein starker Desktop-Prototyp mit guter visueller Story ist wichtiger als volle technische Breite.

⸻

17. Anforderungen an den Entwickler

Der Entwickler soll den Prototyp so umsetzen, dass man die Idee realistisch demonstrieren kann.

Erwartetes Ergebnis
	•	klickbarer High-Fidelity Web-Prototyp
	•	mehrere Screens oder States
	•	realistische Mock-Daten
	•	nachvollziehbarer End-to-End Flow
	•	UI mit klarer Storyline

Priorisierung
	1.	starker Upload-to-Summary Flow
	2.	hochwertige Summary-Seite
	3.	Labor-Chart
	4.	Diagnosen + Timeline
	5.	Q&A-Komponente
	6.	Quellennachweise

Nicht prioritaer
	•	Produktionsarchitektur
	•	Security Hardening
	•	Skalierbarkeit
	•	Edge Cases in voller Tiefe

⸻

18. Mock-Daten Anforderungen

Es sollen realistisch wirkende, aber fiktive medizinische Dokumente genutzt werden.

Empfohlene Datensaetze

Mindestens 1 bis 2 Mock-Patienten mit je:
	•	8 bis 15 Dokumenten
	•	mehreren Dokumenttypen
	•	Diagnosen ueber mehrere Jahre
	•	mindestens 1 bis 2 Laborverlaeufen
	•	mindestens 1 Facharztverlauf
	•	mindestens 1 Spitalereignis

Beispielparameter fuer Charts
	•	PSA
	•	HbA1c
	•	Kreatinin
	•	CRP
	•	LDL

