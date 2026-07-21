// src/repositories/scheduleRepository.ts
import { unstable_cache } from "next/cache";
import type { ScheduleItem } from "@/types/schedule";
import { db, schema } from "@/lib/db";
import { fetchSheetRange } from "@/lib/sheets/client";

const RANGE = "jadwal!A2:G100";

function parseScheduleRow(row: string[], index: number): ScheduleItem | null {
  const [date, timeStart, timeEnd, title, description, location, type] = row;
  if (!date || !title) return null;
  return {
    id: `sched-${index}`,
    date: date.trim(),
    timeStart: timeStart?.trim() || "00:00",
    timeEnd: timeEnd?.trim() || null,
    title: title.trim(),
    description: description?.trim() || "",
    location: location?.trim() || "Pekarangan Bapak Sugiyanto",
    type: (type?.trim() || "umum") as ScheduleItem["type"],
  };
}

/**
 * Fetch schedule from Neon PostgreSQL database (primary)
 * or Google Sheets (backup fallback).
 */
export const getScheduleItems = unstable_cache(
  async (): Promise<ScheduleItem[]> => {
    // 1. Primary Source: Neon PostgreSQL DB
    try {
      if (db) {
        const dbSchedules = await db.select().from(schema.schedules);
        
        if (dbSchedules.length > 0) {
          return (dbSchedules as ScheduleItem[]).sort((a, b) => a.date.localeCompare(b.date));
        }

        // Auto-seed if database table is empty
        console.log("[db] Schedule table is empty. Seeding with fallback data...");
        const seedData = fallbackScheduleItems.map((s) => ({
          date: s.date,
          timeStart: s.timeStart,
          timeEnd: s.timeEnd,
          title: s.title,
          description: s.description,
          location: s.location,
          type: s.type,
        }));

        await db.insert(schema.schedules).values(seedData);

        // Fetch again after seeding
        const freshSchedules = await db.select().from(schema.schedules);
        return (freshSchedules as ScheduleItem[]).sort((a, b) => a.date.localeCompare(b.date));
      }
    } catch (error) {
      console.warn("[db] Failed to fetch schedule from database, trying sheets backup fallback...", error);
    }

    // 2. Backup Fallback: Google Sheets
    try {
      const rows = await fetchSheetRange(RANGE);
      return rows
        .map((row, i) => parseScheduleRow(row, i))
        .filter((s): s is ScheduleItem => s !== null)
        .sort((a, b) => a.date.localeCompare(b.date));
    } catch (error) {
      console.error("[sheets] Failed to fetch schedule from sheet, using local fallback data:", error);
      return fallbackScheduleItems;
    }
  },
  ["schedule-items"],
  { revalidate: 3600, tags: ["schedule"] }
);

// ─── Fallback / Seed Data ──────────────────────────────────
export const fallbackScheduleItems: ScheduleItem[] = [
  {
    id: "s1",
    date: "2026-08-01",
    timeStart: "15:00",
    timeEnd: null,
    title: "Pekan Lomba Anak-Anak",
    description: "Rangkaian perlombaan untuk PAUD, TK, dan SD. Makan Kerupuk, Kuk Geruk, Estafet Karet, Pukul Air & Balap Karung.",
    location: "Pekarangan Bapak Sugiyanto",
    type: "anak",
  },
  {
    id: "s2",
    date: "2026-08-02",
    timeStart: "15:00",
    timeEnd: null,
    title: "Pekan Lomba Anak-Anak (Hari 2)",
    description: "Lanjutan perlombaan anak hari kedua.",
    location: "Pekarangan Bapak Sugiyanto",
    type: "anak",
  },
  {
    id: "s3",
    date: "2026-08-03",
    timeStart: "19:00",
    timeEnd: null,
    title: "Pekan Lomba Dewasa",
    description: "Perlombaan untuk Ibu-ibu, Pemudi, Bapak-bapak, dan Pemuda. Mulai tanggal 3–10 Agustus.",
    location: "Pekarangan Bapak Sugiyanto",
    type: "dewasa",
  },
  {
    id: "s4",
    date: "2026-08-16",
    timeStart: "06:00",
    timeEnd: null,
    title: "Puncak Acara: Jalan Sehat Bersama",
    description: "Menyusuri rute lingkungan desa, menyatukan seluruh generasi Blumbang RT 15. Diakhiri dengan pembagian doorprize menarik.",
    location: "Pekarangan Bapak Sugiyanto",
    type: "puncak",
  },
];
