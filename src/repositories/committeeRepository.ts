// src/repositories/committeeRepository.ts
import { unstable_cache } from "next/cache";
import type { CommitteeMember } from "@/types/committee";
import { db, schema } from "@/lib/db";
import { fetchSheetRange } from "@/lib/sheets/client";

const RANGE = "panitia!A2:E100";

function parseCommitteeRow(row: string[], index: number): CommitteeMember | null {
  const [name, role, division, sortOrderStr] = row;
  if (!name || !role) return null;
  return {
    id: `committee-${index}`,
    name: name.trim(),
    role: role.trim(),
    division: (division?.trim() ?? "inti") as CommitteeMember["division"],
    sortOrder: parseInt(sortOrderStr ?? String(index), 10) || index,
  };
}

/**
 * Fetch committee members from Neon PostgreSQL database (primary)
 * or Google Sheets (backup fallback).
 */
export const getCommitteeMembers = unstable_cache(
  async (): Promise<CommitteeMember[]> => {
    // 1. Primary Source: Neon PostgreSQL DB
    try {
      if (db) {
        const dbMembers = await db.select().from(schema.committeeMembers);
        
        if (dbMembers.length > 0) {
          return (dbMembers as CommitteeMember[]).sort((a, b) => a.sortOrder - b.sortOrder);
        }

        // Auto-seed if database table is empty
        console.log("[db] Committee table is empty. Seeding with fallback data...");
        const seedData = fallbackCommitteeMembers.map((m) => ({
          name: m.name,
          role: m.role,
          division: m.division,
          sortOrder: m.sortOrder,
        }));
        
        await db.insert(schema.committeeMembers).values(seedData);
        
        // Fetch again after seeding
        const freshMembers = await db.select().from(schema.committeeMembers);
        return (freshMembers as CommitteeMember[]).sort((a, b) => a.sortOrder - b.sortOrder);
      }
    } catch (error) {
      console.warn("[db] Failed to fetch committee from database, trying sheets backup fallback...", error);
    }

    // 2. Backup Fallback: Google Sheets
    try {
      const rows = await fetchSheetRange(RANGE);
      const members = rows
        .map((row, i) => parseCommitteeRow(row, i))
        .filter((m): m is CommitteeMember => m !== null);

      return members.sort((a, b) => a.sortOrder - b.sortOrder);
    } catch (error) {
      console.error("[sheets] Failed to fetch committee from sheet, using local fallback data:", error);
      return fallbackCommitteeMembers;
    }
  },
  ["committee-members"],
  { revalidate: 3600, tags: ["committee"] }
);

// ─── Fallback / Seed Data ──────────────────────────────────
/** Used when Google Sheets is not configured or returns empty data. */
export const fallbackCommitteeMembers: CommitteeMember[] = [
  // Pimpinan
  { id: "c0", name: "MUH BASARI", role: "Ketua RT 15", division: "pimpinan", sortOrder: 0 },
  
  // Inti
  { id: "c1", name: "DIDIK", role: "Ketua Panitia", division: "inti", sortOrder: 1 },
  { id: "c2", name: "FARIH", role: "Ketua Panitia", division: "inti", sortOrder: 2 },
  { id: "c3", name: "GIYANTI", role: "Ketua Panitia", division: "inti", sortOrder: 3 },
  { id: "c4", name: "MEITHA", role: "Sekretaris", division: "inti", sortOrder: 4 },
  { id: "c5", name: "ROBBI", role: "Sekretaris", division: "inti", sortOrder: 5 },
  { id: "c6", name: "ENDAH", role: "Bendahara", division: "inti", sortOrder: 6 },
  { id: "c7", name: "JAMIL", role: "Bendahara", division: "inti", sortOrder: 7 },
  
  // Seksi Perlombaan
  { id: "c8", name: "DANIF", role: "Anggota (Lomba Anak)", division: "perlombaan", sortOrder: 10 },
  { id: "c9", name: "BAYU", role: "Anggota (Lomba Anak)", division: "perlombaan", sortOrder: 11 },
  { id: "c10", name: "TIA", role: "Anggota (Lomba Anak)", division: "perlombaan", sortOrder: 12 },
  { id: "c11", name: "RISMA", role: "Anggota (Lomba Anak)", division: "perlombaan", sortOrder: 13 },
  { id: "c12", name: "WISNU", role: "Anggota (Lomba Ibu)", division: "perlombaan", sortOrder: 14 },
  { id: "c13", name: "DANI", role: "Anggota (Lomba Ibu)", division: "perlombaan", sortOrder: 15 },
  { id: "c14", name: "SALMA", role: "Anggota (Lomba Ibu)", division: "perlombaan", sortOrder: 16 },
  { id: "c15", name: "SITI", role: "Anggota (Lomba Ibu)", division: "perlombaan", sortOrder: 17 },
  { id: "c15_1", name: "FARHAN", role: "Anggota (Lomba Bapak)", division: "perlombaan", sortOrder: 18 },
  { id: "c15_2", name: "NABILA", role: "Anggota (Lomba Bapak)", division: "perlombaan", sortOrder: 19 },
  { id: "c15_3", name: "BAYU S", role: "Anggota (Lomba Bapak)", division: "perlombaan", sortOrder: 20 },
  { id: "c15_4", name: "AULIA", role: "Anggota (Lomba Bapak)", division: "perlombaan", sortOrder: 21 },
  
  // Seksi Konsumsi
  { id: "c20", name: "ISNANTO", role: "Anggota", division: "konsumsi", sortOrder: 30 },
  { id: "c21", name: "FARUQ", role: "Anggota", division: "konsumsi", sortOrder: 31 },
  { id: "c21_1", name: "FELANO", role: "Anggota", division: "konsumsi", sortOrder: 32 },
  { id: "c21_2", name: "ASYIFA", role: "Anggota", division: "konsumsi", sortOrder: 33 },
  { id: "c21_3", name: "RARA", role: "Anggota", division: "konsumsi", sortOrder: 34 },
  { id: "c21_4", name: "KHOLIS", role: "Anggota", division: "konsumsi", sortOrder: 35 },
  { id: "c21_5", name: "ZIMI", role: "Anggota", division: "konsumsi", sortOrder: 36 },
  
  // Seksi Perlengkapan
  { id: "c16", name: "SAPAK", role: "Anggota", division: "perlengkapan", sortOrder: 40 },
  { id: "c17", name: "ALIN", role: "Anggota", division: "perlengkapan", sortOrder: 41 },
  { id: "c18", name: "ZOGA", role: "Anggota", division: "perlengkapan", sortOrder: 42 },
  { id: "c19", name: "WAFIQ", role: "Anggota", division: "perlengkapan", sortOrder: 43 },
  { id: "c19_1", name: "ZALFA", role: "Anggota", division: "perlengkapan", sortOrder: 44 },
  { id: "c19_2", name: "SAID", role: "Anggota", division: "perlengkapan", sortOrder: 45 },
  { id: "c19_3", name: "ARIF", role: "Anggota", division: "perlengkapan", sortOrder: 46 },
  
  // Seksi Humas
  { id: "c27", name: "KRISNA", role: "Anggota", division: "humas", sortOrder: 50 },
  { id: "c28", name: "SUFYAN", role: "Anggota", division: "humas", sortOrder: 51 },
  { id: "c28_1", name: "YAYUK", role: "Anggota", division: "humas", sortOrder: 52 },
  { id: "c28_2", name: "NURUL", role: "Anggota", division: "humas", sortOrder: 53 },
  
  // Seksi Keamanan
  { id: "c25", name: "FERI", role: "Anggota", division: "keamanan", sortOrder: 60 },
  { id: "c26", name: "VANDI", role: "Anggota", division: "keamanan", sortOrder: 61 },
  { id: "c26_1", name: "AHMAT", role: "Anggota", division: "keamanan", sortOrder: 62 },
  { id: "c26_2", name: "BAYU ANDRI", role: "Anggota", division: "keamanan", sortOrder: 63 },
  { id: "c26_3", name: "DAFFA", role: "Anggota", division: "keamanan", sortOrder: 64 },
  
  // Seksi Dana
  { id: "c22", name: "TRIYANTO", role: "Anggota", division: "dana", sortOrder: 70 },
  { id: "c23", name: "SUGIYANTO", role: "Anggota", division: "dana", sortOrder: 71 },
  { id: "c24", name: "NITA", role: "Anggota", division: "dana", sortOrder: 72 },
];
