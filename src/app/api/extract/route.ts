import { NextRequest, NextResponse } from "next/server";
import { extractText } from "@/lib/extract";

const ALLOWED_EXTENSIONS = ["pdf", "docx", "doc"];

interface ExtractionResult {
  filename: string;
  text: string;
  pageCount: number;
}

/**
 * Type guard: checks if a FormData entry is a File-like object
 * (has name, arrayBuffer). Uses duck typing to handle cross-realm
 * File instances (jsdom vs. undici).
 */
function isFileLike(
  entry: FormDataEntryValue
): entry is File {
  return (
    typeof entry === "object" &&
    entry !== null &&
    "name" in entry &&
    "arrayBuffer" in entry &&
    typeof (entry as File).arrayBuffer === "function"
  );
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files");

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "Keine Dateien hochgeladen." },
        { status: 400 }
      );
    }

    const results: ExtractionResult[] = [];
    const errors: { filename: string; error: string }[] = [];

    for (const file of files) {
      if (!isFileLike(file)) {
        errors.push({
          filename: "unbekannt",
          error: "Ungültiger Dateieintrag.",
        });
        continue;
      }

      const extension = file.name.toLowerCase().split(".").pop() ?? "";
      if (!ALLOWED_EXTENSIONS.includes(extension)) {
        errors.push({
          filename: file.name,
          error: `Nicht unterstütztes Format: .${extension}`,
        });
        continue;
      }

      try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { text, pageCount } = await extractText(buffer, file.name);

        results.push({
          filename: file.name,
          text,
          pageCount,
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unbekannter Fehler";
        errors.push({ filename: file.name, error: message });
      }
    }

    return NextResponse.json({ results, errors });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unbekannter Fehler";
    return NextResponse.json(
      { error: `Verarbeitung fehlgeschlagen: ${message}` },
      { status: 500 }
    );
  }
}
