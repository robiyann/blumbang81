// src/repositories/financeRepository.ts
import { unstable_cache } from "next/cache";
import { db, schema } from "@/lib/db";
import { fetchSheetRange } from "@/lib/sheets/client";

const RANGE = "keuangan!A2:D100";

export interface BudgetAllocation {
  percentage: number;
  amount: number;
  label: string;
  description: string;
  colorClass: string;
  textColorClass: string;
}

const colorClasses = [
  "bg-[#a70009]",
  "bg-[#181c1f]",
  "bg-[#686a6a]",
  "bg-[#d7dade]",
];

const textColorClasses = [
  "text-[#a70009]",
  "text-[#181c1f]",
  "text-[#686a6a]",
  "text-[#5c403c]",
];

function parseFinanceRow(row: string[], index: number): BudgetAllocation | null {
  const [percentageStr, amountStr, label, description] = row;
  if (!label || !amountStr) return null;
  
  const amount = parseInt(amountStr.replace(/[^0-9]/g, ""), 10) || 0;
  const percentage = parseInt(percentageStr.replace(/[^0-9]/g, ""), 10) || 0;
  
  const colorIndex = index % colorClasses.length;

  return {
    percentage,
    amount,
    label: label.trim(),
    description: description?.trim() || "",
    colorClass: colorClasses[colorIndex],
    textColorClass: textColorClasses[colorIndex],
  };
}

export const getFinanceItems = unstable_cache(
  async (): Promise<BudgetAllocation[]> => {
    // 1. Primary Source: Neon PostgreSQL DB
    try {
      if (db) {
        const dbFinance = await db.select().from(schema.financeAllocations);
        
        if (dbFinance.length > 0) {
          return dbFinance.map((item, index) => {
            const colorIndex = index % colorClasses.length;
            return {
              percentage: item.percentage,
              amount: item.amount,
              label: item.label,
              description: item.description,
              colorClass: colorClasses[colorIndex],
              textColorClass: textColorClasses[colorIndex],
            };
          });
        }

        // Auto-seed if database table is empty
        console.log("[db] Finance allocations table is empty. Seeding with fallback data...");
        const seedData = fallbackFinanceAllocations.map((item) => ({
          percentage: item.percentage,
          amount: item.amount,
          label: item.label,
          description: item.description,
        }));

        await db.insert(schema.financeAllocations).values(seedData);

        // Fetch again after seeding
        const freshFinance = await db.select().from(schema.financeAllocations);
        return freshFinance.map((item, index) => {
          const colorIndex = index % colorClasses.length;
          return {
            percentage: item.percentage,
            amount: item.amount,
            label: item.label,
            description: item.description,
            colorClass: colorClasses[colorIndex],
            textColorClass: textColorClasses[colorIndex],
          };
        });
      }
    } catch (error) {
      console.warn("[db] Failed to fetch finance items from database, trying sheets backup fallback...", error);
    }

    // 2. Backup Fallback: Google Sheets
    try {
      const rows = await fetchSheetRange(RANGE);
      if (rows.length > 0) {
        return rows
          .map((row, i) => parseFinanceRow(row, i))
          .filter((f): f is BudgetAllocation => f !== null);
      }
    } catch (error) {
      console.error("[sheets] Failed to fetch finance items from sheet, trying local fallback:", error);
    }

    // 3. Fallback to Local Data
    return fallbackFinanceAllocations.map((item, index) => {
      const colorIndex = index % colorClasses.length;
      return {
        percentage: item.percentage,
        amount: item.amount,
        label: item.label,
        description: item.description,
        colorClass: colorClasses[colorIndex],
        textColorClass: textColorClasses[colorIndex],
      };
    });
  },
  ["finance-items-v2"],
  { revalidate: 3600, tags: ["finance"] }
);

// ─── Fallback / Seed Data ──────────────────────────────────
export const fallbackFinanceAllocations = [
  {
    percentage: 3,
    amount: 800000,
    label: "Persiapan & Kepanitiaan",
    description: "Dekorasi panggung/lingkungan (Rp 500rb), ATK/kepanitiaan (Rp 100rb), konsumsi rapat koordinasi warga (Rp 200rb).",
  },
  {
    percentage: 29,
    amount: 9000000,
    label: "Acara Perlombaan HUT RI",
    description: "Perlengkapan lomba (Rp 1jt), konsumsi peserta & panitia (Rp 1jt), doorprize hiburan (Rp 500rb), serta total hadiah perlombaan anak-anak, ibu-ibu, & bapak-bapak (Rp 5.5jt).",
  },
  {
    percentage: 66,
    amount: 20500000,
    label: "Acara Jalan Sehat & Puncak",
    description: "Perlengkapan panggung/sewa tenda (Rp 3jt), konsumsi warga (Rp 2.5jt), hadiah utama & doorprize jalan sehat (Rp 14jt), serta dokumentasi kegiatan (Rp 1jt).",
  },
  {
    percentage: 2,
    amount: 500000,
    label: "Dana Darurat / Tak Terduga",
    description: "Alokasi dana cadangan untuk mengantisipasi kebutuhan mendadak atau pengeluaran tidak terduga selama seluruh rangkaian acara.",
  },
];
