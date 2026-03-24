"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from "react";
import type { PatientRecord } from "@/types/patient";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type FileStatus =
  | "pending"
  | "uploading"
  | "extracting"
  | "extracted"
  | "error";

export type ProcessingStage =
  | "idle"
  | "extracting"
  | "analyzing"
  | "complete"
  | "error";

export interface UploadFile {
  id: string;
  file: File;
  status: FileStatus;
  errorMessage?: string;
}

export interface ExtractedText {
  filename: string;
  text: string;
  pageCount: number;
}

interface UploadState {
  files: UploadFile[];
  extractedTexts: ExtractedText[];
  patientRecord: PatientRecord | null;
  processingStage: ProcessingStage;
  errorMessage: string | null;
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

type Action =
  | { type: "ADD_FILES"; payload: UploadFile[] }
  | { type: "REMOVE_FILE"; payload: string }
  | { type: "SET_FILE_STATUS"; payload: { id: string; status: FileStatus; errorMessage?: string } }
  | { type: "SET_PROCESSING_STAGE"; payload: ProcessingStage }
  | { type: "SET_EXTRACTED_TEXTS"; payload: ExtractedText[] }
  | { type: "SET_PATIENT_RECORD"; payload: PatientRecord }
  | { type: "SET_ERROR"; payload: string }
  | { type: "RESET" };

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

const initialState: UploadState = {
  files: [],
  extractedTexts: [],
  patientRecord: null,
  processingStage: "idle",
  errorMessage: null,
};

function uploadReducer(state: UploadState, action: Action): UploadState {
  switch (action.type) {
    case "ADD_FILES":
      return {
        ...state,
        files: [...state.files, ...action.payload],
        errorMessage: null,
      };
    case "REMOVE_FILE":
      return {
        ...state,
        files: state.files.filter((f) => f.id !== action.payload),
      };
    case "SET_FILE_STATUS":
      return {
        ...state,
        files: state.files.map((f) =>
          f.id === action.payload.id
            ? { ...f, status: action.payload.status, errorMessage: action.payload.errorMessage }
            : f
        ),
      };
    case "SET_PROCESSING_STAGE":
      return { ...state, processingStage: action.payload };
    case "SET_EXTRACTED_TEXTS":
      return { ...state, extractedTexts: action.payload };
    case "SET_PATIENT_RECORD":
      return { ...state, patientRecord: action.payload, processingStage: "complete" };
    case "SET_ERROR":
      return { ...state, processingStage: "error", errorMessage: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface UploadContextValue {
  state: UploadState;
  addFiles: (files: File[]) => void;
  removeFile: (id: string) => void;
  setFileStatus: (id: string, status: FileStatus, errorMessage?: string) => void;
  setProcessingStage: (stage: ProcessingStage) => void;
  setExtractedTexts: (texts: ExtractedText[]) => void;
  setPatientRecord: (record: PatientRecord) => void;
  setError: (message: string) => void;
  reset: () => void;
  startProcessing: () => Promise<void>;
}

const UploadContext = createContext<UploadContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

let fileIdCounter = 0;

export function UploadStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(uploadReducer, initialState);

  const addFiles = useCallback((files: File[]) => {
    const uploadFiles: UploadFile[] = files.map((file) => ({
      id: `file-${++fileIdCounter}`,
      file,
      status: "pending" as const,
    }));
    dispatch({ type: "ADD_FILES", payload: uploadFiles });
  }, []);

  const removeFile = useCallback((id: string) => {
    dispatch({ type: "REMOVE_FILE", payload: id });
  }, []);

  const setFileStatus = useCallback(
    (id: string, status: FileStatus, errorMessage?: string) => {
      dispatch({ type: "SET_FILE_STATUS", payload: { id, status, errorMessage } });
    },
    []
  );

  const setProcessingStage = useCallback((stage: ProcessingStage) => {
    dispatch({ type: "SET_PROCESSING_STAGE", payload: stage });
  }, []);

  const setExtractedTexts = useCallback((texts: ExtractedText[]) => {
    dispatch({ type: "SET_EXTRACTED_TEXTS", payload: texts });
  }, []);

  const setPatientRecord = useCallback((record: PatientRecord) => {
    dispatch({ type: "SET_PATIENT_RECORD", payload: record });
  }, []);

  const setError = useCallback((message: string) => {
    dispatch({ type: "SET_ERROR", payload: message });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  const startProcessing = useCallback(async () => {
    const currentFiles = state.files;
    if (currentFiles.length === 0) return;

    // --- Phase 1: Extract text from files ---
    dispatch({ type: "SET_PROCESSING_STAGE", payload: "extracting" });

    // Mark all files as uploading
    for (const f of currentFiles) {
      dispatch({
        type: "SET_FILE_STATUS",
        payload: { id: f.id, status: "uploading" },
      });
    }

    try {
      const formData = new FormData();
      for (const f of currentFiles) {
        formData.append("files", f.file);
      }

      // Mark as extracting
      for (const f of currentFiles) {
        dispatch({
          type: "SET_FILE_STATUS",
          payload: { id: f.id, status: "extracting" },
        });
      }

      const extractRes = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });

      if (!extractRes.ok) {
        const err = await extractRes.json();
        throw new Error(err.error || "Extraktion fehlgeschlagen");
      }

      const extractData = await extractRes.json() as {
        results: ExtractedText[];
        errors: { filename: string; error: string }[];
      };

      // Update per-file status based on results/errors
      const successFilenames = new Set(extractData.results.map((r) => r.filename));
      const errorMap = new Map(extractData.errors.map((e) => [e.filename, e.error]));

      for (const f of currentFiles) {
        if (successFilenames.has(f.file.name)) {
          dispatch({
            type: "SET_FILE_STATUS",
            payload: { id: f.id, status: "extracted" },
          });
        } else if (errorMap.has(f.file.name)) {
          dispatch({
            type: "SET_FILE_STATUS",
            payload: {
              id: f.id,
              status: "error",
              errorMessage: errorMap.get(f.file.name),
            },
          });
        }
      }

      dispatch({ type: "SET_EXTRACTED_TEXTS", payload: extractData.results });

      if (extractData.results.length === 0) {
        throw new Error("Keine Texte konnten extrahiert werden.");
      }

      // --- Phase 2: Analyze extracted texts ---
      dispatch({ type: "SET_PROCESSING_STAGE", payload: "analyzing" });

      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documents: extractData.results.map((r) => ({
            filename: r.filename,
            text: r.text,
          })),
        }),
      });

      if (!analyzeRes.ok) {
        const err = await analyzeRes.json();
        throw new Error(err.error || "Analyse fehlgeschlagen");
      }

      const record: PatientRecord = await analyzeRes.json();
      dispatch({ type: "SET_PATIENT_RECORD", payload: record });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unbekannter Fehler";
      dispatch({ type: "SET_ERROR", payload: message });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.files]);

  return (
    <UploadContext.Provider
      value={{
        state,
        addFiles,
        removeFile,
        setFileStatus,
        setProcessingStage,
        setExtractedTexts,
        setPatientRecord,
        setError,
        reset,
        startProcessing,
      }}
    >
      {children}
    </UploadContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useUploadStore() {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error("useUploadStore must be used within an UploadStoreProvider");
  }
  return context;
}
