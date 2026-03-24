"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface SourceSheetContext {
  /** ID of document currently shown in SourceDetail sheet, null if closed */
  sourceDocId: string | null;
  openSource: (docId: string) => void;
  closeSource: () => void;
}

const Ctx = createContext<SourceSheetContext | null>(null);

export function SourceSheetProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sourceDocId, setSourceDocId] = useState<string | null>(null);

  const openSource = useCallback((id: string) => setSourceDocId(id), []);
  const closeSource = useCallback(() => setSourceDocId(null), []);

  return (
    <Ctx.Provider value={{ sourceDocId, openSource, closeSource }}>
      {children}
    </Ctx.Provider>
  );
}

export function useSourceSheet(): SourceSheetContext {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error("useSourceSheet must be used within SourceSheetProvider");
  }
  return ctx;
}
