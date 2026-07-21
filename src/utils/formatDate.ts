// src/utils/formatDate.ts
import { format, parseISO, isValid } from "date-fns";
import { id } from "date-fns/locale";

/**
 * Format a date string to Indonesian locale format.
 * @example formatDate("2026-08-17") → "17 Agustus 2026"
 */
export function formatDate(
  dateStr: string,
  pattern = "d MMMM yyyy"
): string {
  try {
    const date = parseISO(dateStr);
    if (!isValid(date)) return dateStr;
    return format(date, pattern, { locale: id });
  } catch {
    return dateStr;
  }
}

/**
 * Format a date-time string.
 * @example formatDateTime("2026-08-17T06:00:00") → "Minggu, 17 Agustus 2026 · 06.00 WIB"
 */
export function formatDateTime(dateStr: string): string {
  try {
    const date = parseISO(dateStr);
    if (!isValid(date)) return dateStr;
    return format(date, "EEEE, d MMMM yyyy · HH.mm 'WIB'", { locale: id });
  } catch {
    return dateStr;
  }
}

/**
 * Format time only
 * @example formatTime("06:00") → "06.00 WIB"
 */
export function formatTime(time: string): string {
  if (!time) return "";
  return time.replace(":", ".") + " WIB";
}

/**
 * Get relative time string
 */
export function getRelativeDate(dateStr: string): string {
  try {
    const date = parseISO(dateStr);
    if (!isValid(date)) return dateStr;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hari ini";
    if (diffDays === 1) return "Kemarin";
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return format(date, "d MMMM yyyy", { locale: id });
  } catch {
    return dateStr;
  }
}
