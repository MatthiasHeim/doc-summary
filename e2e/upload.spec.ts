import { test, expect } from "@playwright/test";

test.describe("Upload-Seite", () => {
  test("zeigt Landing Page mit Titel und Upload-Zone", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByText("Patientenakte intelligent zusammenfassen")
    ).toBeVisible();
    await expect(
      page.getByText("Dokumente hierher ziehen")
    ).toBeVisible();
  });

  test("zeigt akzeptierte Dateiformate", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("PDF")).toBeVisible();
    await expect(page.getByText("DOCX")).toBeVisible();
    await expect(page.getByText("DOC", { exact: true })).toBeVisible();
  });

  test("CTA Button ist initial nicht sichtbar", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("button", { name: /Verarbeitung starten/i })
    ).not.toBeVisible();
  });

  test("Datei-Upload zeigt Datei in Liste und CTA", async ({ page }) => {
    await page.goto("/");

    // Upload a test PDF via the file input
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles("test_data/KSGR an Geiselweid.pdf");

    // File should appear in the list
    await expect(page.getByText("KSGR an Geiselweid.pdf")).toBeVisible();

    // CTA should now be visible
    await expect(
      page.getByRole("button", { name: /Verarbeitung starten/i })
    ).toBeVisible();
  });

  test("Datei kann entfernt werden", async ({ page }) => {
    await page.goto("/");

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles("test_data/KSGR an Geiselweid.pdf");

    await expect(page.getByText("KSGR an Geiselweid.pdf")).toBeVisible();

    // Click remove button
    await page.getByRole("button", { name: /entfernen/i }).first().click();

    // File should be gone
    await expect(page.getByText("KSGR an Geiselweid.pdf")).not.toBeVisible();
  });
});

test.describe("Navigation", () => {
  test("Nav-Header zeigt App-Name", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Patientenübersicht")).toBeVisible();
  });

  test("Processing-Seite redirected ohne Dateien", async ({ page }) => {
    await page.goto("/processing");
    // Should redirect back to home since no files are uploaded
    await expect(page).toHaveURL("/");
  });
});
