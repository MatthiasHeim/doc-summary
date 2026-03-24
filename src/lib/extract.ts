import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

interface PDFTextResult {
  pages: { text: string }[];
}

/**
 * pdf-parse v2 types mark load/getText as private, but they are
 * the public API. We use a minimal interface to avoid TS errors.
 */
interface PDFParserInstance {
  load(): Promise<unknown>;
  getText(): Promise<PDFTextResult>;
}

/**
 * Extract text content from a PDF buffer using pdf-parse v2.
 * Returns { text, pageCount }.
 */
export async function extractTextFromPDF(
  buffer: Buffer
): Promise<{ text: string; pageCount: number }> {
  try {
    const parser = new PDFParse({
      data: new Uint8Array(buffer),
    }) as unknown as PDFParserInstance;
    await parser.load();
    const result = await parser.getText();
    const text = result.pages.map((p) => p.text).join("\n\n");
    const pageCount = result.pages.length;
    return { text: text.trim(), pageCount };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unbekannter Fehler";
    throw new Error(`PDF-Extraktion fehlgeschlagen: ${message}`);
  }
}

/**
 * Extract text content from a Word (.doc/.docx) buffer using mammoth.
 */
export async function extractTextFromWord(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value.trim();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unbekannter Fehler";
    throw new Error(`Word-Extraktion fehlgeschlagen: ${message}`);
  }
}

/**
 * Route extraction based on file extension.
 * Supports .pdf, .docx, and .doc files.
 * Returns { text, pageCount }.
 */
export async function extractText(
  buffer: Buffer,
  filename: string
): Promise<{ text: string; pageCount: number }> {
  const extension = filename.toLowerCase().split(".").pop();

  switch (extension) {
    case "pdf": {
      return extractTextFromPDF(buffer);
    }
    case "docx":
    case "doc": {
      const text = await extractTextFromWord(buffer);
      // Rough estimate for Word documents: ~3000 chars per page
      const pageCount = Math.max(1, Math.ceil(text.length / 3000));
      return { text, pageCount };
    }
    default:
      throw new Error(
        `Nicht unterstütztes Dateiformat: .${extension}. Unterstützt werden: .pdf, .docx, .doc`
      );
  }
}
