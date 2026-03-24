import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import React from "react";

const mockRemoveFile = vi.fn();
const mockState = {
  files: [] as Array<{
    id: string;
    file: { name: string; size: number };
    status: string;
    errorMessage?: string;
  }>,
  extractedTexts: [],
  patientRecord: null,
  processingStage: "idle" as const,
  errorMessage: null,
};

vi.mock("@/lib/upload-store", () => ({
  useUploadStore: () => ({
    state: mockState,
    removeFile: mockRemoveFile,
  }),
}));

import { FileList } from "../FileList";

describe("FileList", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    mockState.files = [];
    mockRemoveFile.mockClear();
  });

  it("renders nothing when there are no files", () => {
    const { container } = render(<FileList />);
    expect(container.innerHTML).toBe("");
  });

  it("renders file names and sizes", () => {
    mockState.files = [
      {
        id: "f1",
        file: { name: "Laborbefund.pdf", size: 2048 },
        status: "pending",
      },
      {
        id: "f2",
        file: { name: "Spitalbericht.docx", size: 1048576 },
        status: "pending",
      },
    ] as any;

    render(<FileList />);
    expect(screen.getAllByText("Laborbefund.pdf").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("2.0 KB").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Spitalbericht.docx").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("1.0 MB").length).toBeGreaterThanOrEqual(1);
  });

  it("shows 'Bereit' badge for pending files", () => {
    mockState.files = [
      { id: "f1", file: { name: "test.pdf", size: 100 }, status: "pending" },
    ] as any;

    render(<FileList />);
    expect(screen.getAllByText("Bereit").length).toBeGreaterThanOrEqual(1);
  });

  it("shows 'Fertig' badge for extracted files", () => {
    mockState.files = [
      { id: "f1", file: { name: "test.pdf", size: 100 }, status: "extracted" },
    ] as any;

    render(<FileList />);
    expect(screen.getAllByText("Fertig").length).toBeGreaterThanOrEqual(1);
  });

  it("shows 'Fehler' badge for error files", () => {
    mockState.files = [
      {
        id: "f1",
        file: { name: "test.pdf", size: 100 },
        status: "error",
        errorMessage: "Datei konnte nicht gelesen werden",
      },
    ] as any;

    render(<FileList />);
    expect(screen.getAllByText("Fehler").length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getAllByText("Datei konnte nicht gelesen werden").length
    ).toBeGreaterThanOrEqual(1);
  });

  it("shows 'Hochladen' badge for uploading files", () => {
    mockState.files = [
      { id: "f1", file: { name: "test.pdf", size: 100 }, status: "uploading" },
    ] as any;

    render(<FileList />);
    expect(screen.getAllByText("Hochladen").length).toBeGreaterThanOrEqual(1);
  });

  it("shows 'Extrahieren' badge for extracting files", () => {
    mockState.files = [
      {
        id: "f1",
        file: { name: "test.pdf", size: 100 },
        status: "extracting",
      },
    ] as any;

    render(<FileList />);
    expect(screen.getAllByText("Extrahieren").length).toBeGreaterThanOrEqual(1);
  });

  it("shows remove button for pending files when not readonly", () => {
    mockState.files = [
      { id: "f1", file: { name: "test.pdf", size: 100 }, status: "pending" },
    ] as any;

    render(<FileList />);
    const buttons = screen.getAllByRole("button", {
      name: "test.pdf entfernen",
    });
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });

  it("calls removeFile when remove button is clicked", () => {
    mockState.files = [
      { id: "f1", file: { name: "test.pdf", size: 100 }, status: "pending" },
    ] as any;

    render(<FileList />);
    const buttons = screen.getAllByRole("button", {
      name: "test.pdf entfernen",
    });
    fireEvent.click(buttons[0]);
    expect(mockRemoveFile).toHaveBeenCalledWith("f1");
  });

  it("hides remove button when readonly is true", () => {
    mockState.files = [
      { id: "f1", file: { name: "test.pdf", size: 100 }, status: "pending" },
    ] as any;

    render(<FileList readonly />);
    expect(
      screen.queryAllByRole("button", { name: "test.pdf entfernen" }).length
    ).toBe(0);
  });

  it("hides remove button for non-pending files", () => {
    mockState.files = [
      {
        id: "f1",
        file: { name: "test.pdf", size: 100 },
        status: "extracted",
      },
    ] as any;

    render(<FileList />);
    expect(
      screen.queryAllByRole("button", { name: "test.pdf entfernen" }).length
    ).toBe(0);
  });
});
