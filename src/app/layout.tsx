import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Patientenübersicht — KI-gestützte Zusammenfassung",
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
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
