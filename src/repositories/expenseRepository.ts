// src/repositories/expenseRepository.ts
import { unstable_cache } from "next/cache";
import { db, schema } from "@/lib/db";
import { fetchSheetRange } from "@/lib/sheets/client";
import type { Expense } from "@/lib/db/schema";

const RANGE = "pengeluaran!A2:E100";

function parseExpenseRow(row: string[], index: number): Expense | null {
  const [id, title, amountStr, spentAt, category] = row;
  if (!title || !amountStr) return null;
  
  const amount = parseInt(amountStr.replace(/[^0-9]/g, ""), 10) || 0;
  return {
    id: id?.trim() || `exp-${index}`,
    title: title.trim(),
    amount,
    spentAt: spentAt?.trim() || new Date().toISOString().split("T")[0],
    category: category?.trim() || "Umum",
    createdAt: new Date(),
  };
}

/**
 * Fetch expenses from Neon PostgreSQL database (primary)
 * or Google Sheets (backup fallback).
 */
export const getExpenses = unstable_cache(
  async (): Promise<Expense[]> => {
    // 1. Primary Source: Neon PostgreSQL DB
    try {
      if (db) {
        const dbExpenses = await db.select().from(schema.expenses);
        // Return sorted results (including empty array if no data yet)
        return (dbExpenses as Expense[]).sort((a, b) => b.spentAt.localeCompare(a.spentAt));
      }
    } catch (error) {
      console.warn("[db] Failed to fetch expenses from database, trying sheets backup fallback...", error);
    }

    // 2. Backup Fallback: Google Sheets
    try {
      const rows = await fetchSheetRange(RANGE);
      return rows
        .map((row, i) => parseExpenseRow(row, i))
        .filter((e): e is Expense => e !== null)
        .sort((a, b) => b.spentAt.localeCompare(a.spentAt));
    } catch (error) {
      console.error("[sheets] Failed to fetch expenses from sheet:", error);
      return [];
    }
  },
  ["expenses-list"],
  { revalidate: 300, tags: ["expenses"] }
);
