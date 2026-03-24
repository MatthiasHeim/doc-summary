import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UploadStoreProvider } from "@/lib/upload-store";
import { SourceSheetProvider } from "@/lib/source-sheet-store";
import { NavHeader } from "@/components/NavHeader";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

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
    <html lang="de" className={inter.variable}>
      <body className={`${inter.className} min-h-screen antialiased`}>
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
