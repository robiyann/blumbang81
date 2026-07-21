// src/repositories/donationRepository.ts
import { unstable_cache } from "next/cache";
import { db, schema } from "@/lib/db";
import { fetchSheetRange } from "@/lib/sheets/client";
import type { Donation } from "@/lib/db/schema";

const RANGE = "donatur!A2:D100";

function parseDonationRow(row: string[], index: number): Donation | null {
  const [id, donorName, amountStr, donatedAt] = row;
  if (!donorName || !amountStr) return null;
  
  const amount = parseInt(amountStr.replace(/[^0-9]/g, ""), 10) || 0;
  return {
    id: id?.trim() || `don-${index}`,
    donorName: donorName.trim(),
    amount,
    donatedAt: donatedAt?.trim() || new Date().toISOString().split("T")[0],
    createdAt: new Date(),
  };
}

/**
 * Fetch donations from Neon PostgreSQL database (primary)
 * or Google Sheets (backup fallback).
 */
export const getDonations = unstable_cache(
  async (): Promise<Donation[]> => {
    // 1. Primary Source: Neon PostgreSQL DB
    try {
      if (db) {
        const dbDonations = await db.select().from(schema.donations);
        // Return sorted results (empty array is valid — no fake seeding)
        return (dbDonations as Donation[]).sort((a, b) => b.donatedAt.localeCompare(a.donatedAt));
      }
    } catch (error) {
      console.warn("[db] Failed to fetch donations from database, trying sheets backup fallback...", error);
    }

    // 2. Backup Fallback: Google Sheets
    try {
      const rows = await fetchSheetRange(RANGE);
      return rows
        .map((row, i) => parseDonationRow(row, i))
        .filter((d): d is Donation => d !== null)
        .sort((a, b) => b.donatedAt.localeCompare(a.donatedAt));
    } catch (error) {
      console.error("[sheets] Failed to fetch donations from sheet:", error);
      return [];
    }
  },
  ["donations-list"],
  { revalidate: 300, tags: ["donations"] }
);
