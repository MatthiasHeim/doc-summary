"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText } from "lucide-react";
import { useUploadStore } from "@/lib/upload-store";

export function NavHeader() {
  const pathname = usePathname();
  const { state } = useUploadStore();
  const hasRecord = !!state.patientRecord;

  const navItems = hasRecord
    ? [
        { href: "/summary", label: "Dashboard" },
        { href: "/documents", label: "Dokumente" },
        { href: "/qa", label: "Fragen" },
      ]
    : [];

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-[var(--foreground)]"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-white">
            <FileText className="h-4 w-4" />
          </div>
          <span className="text-base font-semibold tracking-tight">
            Patientenübersicht
          </span>
        </Link>

        {navItems.length > 0 && (
          <nav className="flex items-center gap-4 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  pathname === item.href
                    ? "font-medium text-[var(--primary)]"
                    : "text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
