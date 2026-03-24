import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import {
  extractText,
  extractTextFromPDF,
  extractTextFromDocx,
} from "@/lib/extract";

const TEST_DATA_DIR = join(process.cwd(), "test_data");

describe("extractTextFromPDF", () => {
  it("should extract text from a PDF file", async () => {
    const buffer = readFileSync(join(TEST_DATA_DIR, "Laborbefund.pdf"));
    const { text, pageCount } = await extractTextFromPDF(buffer);

    expect(text).toBeTruthy();
    expect(text.length).toBeGreaterThan(50);
    expect(pageCount).toBeGreaterThanOrEqual(1);
  });

  it("should extract text from the hospital report PDF", async () => {
    const buffer = readFileSync(join(TEST_DATA_DIR, "KSGR an Geiselweid.pdf"));
    const { text, pageCount } = await extractTextFromPDF(buffer);

    expect(text).toBeTruthy();
    expect(text.length).toBeGreaterThan(50);
    expect(pageCount).toBeGreaterThanOrEqual(1);
  });

  it("should throw on invalid buffer", async () => {
    const buffer = Buffer.from("this is not a pdf");
    await expect(extractTextFromPDF(buffer)).rejects.toThrow(
      "PDF-Extraktion fehlgeschlagen"
    );
  });
});

describe("extractTextFromDocx", () => {
  it("should extract text from a .docx file", async () => {
    const buffer = readFileSync(
      join(TEST_DATA_DIR, "Preprod Geiselweid.docx")
    );
    const text = await extractTextFromDocx(buffer);

    expect(text).toBeTruthy();
    expect(text.length).toBeGreaterThan(50);
  });

  it("should extract text from the second .docx file", async () => {
    const buffer = readFileSync(
      join(TEST_DATA_DIR, "Preprod Dinkelacker .docx")
    );
    const text = await extractTextFromDocx(buffer);

    expect(text).toBeTruthy();
    expect(text.length).toBeGreaterThan(50);
  });
});

describe("extractText (routing)", () => {
  it("should route .pdf files to PDF extractor", async () => {
    const buffer = readFileSync(join(TEST_DATA_DIR, "Laborbefund.pdf"));
    const { text, pageCount } = await extractText(buffer, "Laborbefund.pdf");

    expect(text).toBeTruthy();
    expect(text.length).toBeGreaterThan(50);
    expect(pageCount).toBeGreaterThanOrEqual(1);
  });

  it("should route .docx files to Word extractor", async () => {
    const buffer = readFileSync(
      join(TEST_DATA_DIR, "Preprod Geiselweid.docx")
    );
    const { text, pageCount } = await extractText(
      buffer,
      "Preprod Geiselweid.docx"
    );

    expect(text).toBeTruthy();
    expect(text.length).toBeGreaterThan(50);
    expect(pageCount).toBeGreaterThanOrEqual(1);
  });

  it("should handle .doc files gracefully", async () => {
    const buffer = readFileSync(
      join(
        TEST_DATA_DIR,
        "Austrittsbericht AN PRAXIS AM GEISELWEID Mail.doc"
      )
    );

    // .doc files may or may not work with mammoth depending on the format
    // We just verify it doesn't crash with an unexpected error
    try {
      const { text } = await extractText(
        buffer,
        "Austrittsbericht AN PRAXIS AM GEISELWEID Mail.doc"
      );
      expect(typeof text).toBe("string");
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toContain("Word-Extraktion");
    }
  });

  it("should throw on unsupported file extension", async () => {
    const buffer = Buffer.from("test");
    await expect(extractText(buffer, "file.txt")).rejects.toThrow(
      "Nicht unterstütztes Dateiformat"
    );
  });

  it("should handle case-insensitive extensions", async () => {
    const buffer = readFileSync(join(TEST_DATA_DIR, "Laborbefund.pdf"));
    const { text } = await extractText(buffer, "Laborbefund.PDF");

    expect(text).toBeTruthy();
  });
});
