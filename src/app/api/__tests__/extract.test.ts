/**
 * API route tests for /api/extract.
 *
 * Uses the node test environment to ensure proper File/FormData handling
 * (jsdom's implementation differs from native Node.js).
 */

// @vitest-environment node

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { POST } from "@/app/api/extract/route";
import { NextRequest } from "next/server";

const TEST_DATA_DIR = join(process.cwd(), "test_data");

function createFormDataRequest(
  files: { name: string; buffer: Buffer; type: string }[]
): NextRequest {
  const formData = new FormData();

  for (const file of files) {
    const uint8 = new Uint8Array(file.buffer);
    const blob = new Blob([uint8], { type: file.type });
    formData.append("files", new File([blob], file.name, { type: file.type }));
  }

  return new NextRequest("http://localhost:3000/api/extract", {
    method: "POST",
    body: formData,
  });
}

describe("POST /api/extract", () => {
  it("should extract text from a PDF file", async () => {
    const buffer = readFileSync(join(TEST_DATA_DIR, "Laborbefund.pdf"));
    const request = createFormDataRequest([
      { name: "Laborbefund.pdf", buffer, type: "application/pdf" },
    ]);

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.results).toHaveLength(1);
    expect(data.results[0].filename).toBe("Laborbefund.pdf");
    expect(data.results[0].text.length).toBeGreaterThan(50);
    expect(data.results[0].pageCount).toBeGreaterThanOrEqual(1);
    expect(data.errors).toHaveLength(0);
  });

  it("should extract text from a Word file", async () => {
    const buffer = readFileSync(
      join(TEST_DATA_DIR, "Preprod Geiselweid.docx")
    );
    const request = createFormDataRequest([
      {
        name: "Preprod Geiselweid.docx",
        buffer,
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      },
    ]);

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.results).toHaveLength(1);
    expect(data.results[0].filename).toBe("Preprod Geiselweid.docx");
    expect(data.results[0].text.length).toBeGreaterThan(50);
  });

  it("should handle multiple files", async () => {
    const pdfBuffer = readFileSync(join(TEST_DATA_DIR, "Laborbefund.pdf"));
    const docxBuffer = readFileSync(
      join(TEST_DATA_DIR, "Preprod Geiselweid.docx")
    );

    const request = createFormDataRequest([
      { name: "Laborbefund.pdf", buffer: pdfBuffer, type: "application/pdf" },
      {
        name: "Preprod Geiselweid.docx",
        buffer: docxBuffer,
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      },
    ]);

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.results).toHaveLength(2);
  });

  it("should return error for empty form data", async () => {
    const request = new NextRequest("http://localhost:3000/api/extract", {
      method: "POST",
      body: new FormData(),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeTruthy();
  });

  it("should report unsupported file types in errors array", async () => {
    const buffer = Buffer.from("test content");
    const request = createFormDataRequest([
      { name: "notes.txt", buffer, type: "text/plain" },
    ]);

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.results).toHaveLength(0);
    expect(data.errors).toHaveLength(1);
    expect(data.errors[0].filename).toBe("notes.txt");
  });
});
