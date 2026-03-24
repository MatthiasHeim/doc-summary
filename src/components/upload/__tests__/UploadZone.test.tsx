import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { UploadZone } from "../UploadZone";
import { UploadStoreProvider } from "@/lib/upload-store";

function renderWithProvider() {
  return render(
    <UploadStoreProvider>
      <UploadZone />
    </UploadStoreProvider>
  );
}

describe("UploadZone", () => {
  it("renders the default drop prompt", () => {
    renderWithProvider();
    const elements = screen.getAllByText("Dokumente hierher ziehen");
    expect(elements.length).toBeGreaterThanOrEqual(1);
  });

  it("shows the file type badges", () => {
    renderWithProvider();
    expect(screen.getAllByText("PDF").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("DOCX").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("DOC").length).toBeGreaterThanOrEqual(1);
  });

  it("shows the 'Dateien auswaehlen' link text", () => {
    renderWithProvider();
    expect(
      screen.getAllByText("Dateien auswählen").length
    ).toBeGreaterThanOrEqual(1);
  });

  it("renders a file input", () => {
    const { container } = renderWithProvider();
    const inputs = container.querySelectorAll("input");
    expect(inputs.length).toBeGreaterThanOrEqual(1);
  });
});
