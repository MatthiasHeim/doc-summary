import type { Metadata } from "next";
import "./globals.css";
import { UploadStoreProvider } from "@/lib/upload-store";
import { SourceSheetProvider } from "@/lib/source-sheet-store";
import { NavHeader } from "@/components/NavHeader";

export const metadata: Metadata = {
  title: "Patientenübersicht -- KI-gestützte Zusammenfassung",
  description:
    "Unstrukturierte medizinische Dokumente in eine schnelle, nutzbare Patientenübersicht überführen.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className="min-h-screen antialiased">
        <UploadStoreProvider>
          <SourceSheetProvider>
            <NavHeader />
            {children}
          </SourceSheetProvider>
        </UploadStoreProvider>
      </body>
    </html>
  );
}
