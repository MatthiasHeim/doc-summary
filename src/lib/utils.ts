import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  dateStr: string,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!dateStr) return "–";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr || "–";
  return d.toLocaleDateString(
    "de-CH",
    options ?? { day: "2-digit", month: "2-digit", year: "numeric" }
  );
}

export function formatDateLong(dateStr: string): string {
  return formatDate(dateStr, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function safeDateSort(a: string, b: string): number {
  const da = new Date(a).getTime();
  const db = new Date(b).getTime();
  if (isNaN(da) && isNaN(db)) return 0;
  if (isNaN(da)) return 1;
  if (isNaN(db)) return -1;
  return da - db;
}
