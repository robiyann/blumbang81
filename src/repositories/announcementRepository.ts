// src/repositories/announcementRepository.ts
import { unstable_cache } from "next/cache";
import { fetchSheetRange } from "@/lib/sheets/client";
import type { Announcement } from "@/types/announcement";
import { db, schema } from "@/lib/db";

const RANGE = "pengumuman!A2:F100";

function parseAnnouncementRow(row: string[], index: number): Announcement | null {
  const [id, title, content, date, pinned, category] = row;
  if (!title || !content) return null;
  return {
    id: id?.trim() || `ann-${index}`,
    title: title.trim(),
    content: content.trim(),
    date: date?.trim() || new Date().toISOString().split("T")[0],
    pinned: pinned?.toLowerCase() === "true",
    category: category?.trim() || "Umum",
  };
}

/**
 * Fetch announcements from Neon PostgreSQL Database (primary)
 * or Google Sheets (backup fallback).
 */
export const getAnnouncements = unstable_cache(
  async (): Promise<Announcement[]> => {
    // 1. Primary Source: Neon PostgreSQL DB
    try {
      if (db) {
        const dbAnnouncements = await db.select().from(schema.announcements);
        if (dbAnnouncements.length > 0) {
          // Sort: pinned first, then by date descending
          return (dbAnnouncements as Announcement[]).sort((a, b) => {
            if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          });
        }
      }
    } catch (error) {
      console.warn("[db] Failed to fetch announcements from database, trying sheets backup fallback...", error);
    }

    // 2. Backup Fallback: Google Sheets
    try {
      const rows = await fetchSheetRange(RANGE);
      const announcements = rows
        .map((row, i) => parseAnnouncementRow(row, i))
        .filter((a): a is Announcement => a !== null);

      return announcements.sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
    } catch (error) {
      console.error("[sheets] Failed to fetch announcements from sheet, using local fallback data:", error);
      return fallbackAnnouncements;
    }
  },
  ["announcements"],
  { revalidate: 300, tags: ["announcements"] }
);

export const getLatestAnnouncements = unstable_cache(
  async (limit = 3): Promise<Announcement[]> => {
    const all = await getAnnouncements();
    return all.slice(0, limit);
  },
  ["announcements-latest"],
  { revalidate: 300, tags: ["announcements"] }
);

// ─── Fallback Data ─────────────────────────────────────────
export const fallbackAnnouncements: Announcement[] = [
  {
    id: "ann-1",
    title: "Pendaftaran Lomba Anak Dibuka!",
    content:
      "Pendaftaran untuk rangkaian perlombaan anak (PAUD, TK, SD) resmi dibuka. Segera daftarkan putra-putri Anda kepada panitia.",
    date: "2026-07-15",
    pinned: true,
    category: "Pendaftaran",
  },
  {
    id: "ann-2",
    title: "Rapat Koordinasi Panitia",
    content:
      "Seluruh anggota panitia diharap hadir dalam rapat koordinasi perdana di rumah Ketua RT 15 pada hari Sabtu, 1 Agustus 2026.",
    date: "2026-07-20",
    pinned: false,
    category: "Internal",
  },
  {
    id: "ann-3",
    title: "Donasi untuk Kemeriahan HUT RI ke-81",
    content:
      "Kepada Bapak/Ibu warga Blumbang RT 15, kami mengundang partisipasi dalam bentuk donasi untuk menyukseskan acara. Hubungi Sdr. Triyanto.",
    date: "2026-07-10",
    pinned: false,
    category: "Keuangan",
  },
];
