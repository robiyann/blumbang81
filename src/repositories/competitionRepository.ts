// src/repositories/competitionRepository.ts
import { db } from "@/lib/db";
import { competitions, registrations } from "@/lib/db/schema";
import { eq, sql, count } from "drizzle-orm";
import type { Competition } from "@/types/competition";

function mapToCompetition(
  row: typeof competitions.$inferSelect,
  registeredCount: number
): Competition {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    description: row.description,
    ageMin: row.ageMin,
    ageMax: row.ageMax,
    quota: row.quota,
    registeredCount,
    location: row.location,
    scheduleDate: row.scheduleDate,
    scheduleTime: row.scheduleTime,
    prizeDescription: row.prizeDescription,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
  };
}

/**
 * Get all competitions with registration counts.
 */
export async function getAllCompetitions(): Promise<Competition[]> {
  if (!db) return fallbackCompetitions;

  const rows = await db
    .select({
      competition: competitions,
      registeredCount: count(registrations.id),
    })
    .from(competitions)
    .leftJoin(registrations, eq(competitions.id, registrations.competitionId))
    .groupBy(competitions.id)
    .orderBy(competitions.createdAt);

  return rows.map((r) => mapToCompetition(r.competition, r.registeredCount));
}

/**
 * Get a single competition by slug.
 */
export async function getCompetitionBySlug(
  slug: string
): Promise<Competition | null> {
  if (!db) return fallbackCompetitions.find((c) => c.slug === slug) ?? null;

  const [row] = await db
    .select({
      competition: competitions,
      registeredCount: count(registrations.id),
    })
    .from(competitions)
    .leftJoin(registrations, eq(competitions.id, registrations.competitionId))
    .where(eq(competitions.slug, slug))
    .groupBy(competitions.id)
    .limit(1);

  if (!row) return null;
  return mapToCompetition(row.competition, row.registeredCount);
}

// ─── Fallback / Seed Data ──────────────────────────────────
export const fallbackCompetitions: Competition[] = [
  {
    id: "c1",
    slug: "makan-kerupuk",
    name: "Makan Kerupuk",
    category: "anak",
    description: "Perlombaan makan kerupuk tanpa tangan untuk melatih kemandirian dasar anak-anak PAUD.",
    ageMin: 2,
    ageMax: 5,
    quota: 30,
    registeredCount: 0,
    location: "Pekarangan Bapak Sugiyanto",
    scheduleDate: "2026-08-01",
    scheduleTime: "15:00",
    prizeDescription: "Piala + Bingkisan",
    status: "open",
    createdAt: new Date().toISOString(),
  },
  {
    id: "c2",
    slug: "kuk-geruk",
    name: "Kuk Geruk",
    category: "anak",
    description: "Lomba ketangkasan sensorik untuk anak-anak TK usia 5-7 tahun.",
    ageMin: 5,
    ageMax: 7,
    quota: 30,
    registeredCount: 0,
    location: "Pekarangan Bapak Sugiyanto",
    scheduleDate: "2026-08-01",
    scheduleTime: "15:30",
    prizeDescription: "Piala + Bingkisan",
    status: "open",
    createdAt: new Date().toISOString(),
  },
  {
    id: "c3",
    slug: "estafet-karet",
    name: "Estafet Karet",
    category: "anak",
    description: "Lomba estafet karet untuk melatih kerja sama tim kecil bagi SD Kelas 1-3.",
    ageMin: 6,
    ageMax: 10,
    quota: 40,
    registeredCount: 0,
    location: "Pekarangan Bapak Sugiyanto",
    scheduleDate: "2026-08-02",
    scheduleTime: "15:00",
    prizeDescription: "Piala + Uang Pembinaan",
    status: "open",
    createdAt: new Date().toISOString(),
  },
  {
    id: "c4",
    slug: "pukul-air-balap-karung",
    name: "Pukul Air & Balap Karung",
    category: "anak",
    description: "Lomba dua sesi: pukul air dan balap karung untuk SD Kelas 4-6 & SMP. Melatih daya juang dan sportivitas.",
    ageMin: 10,
    ageMax: 16,
    quota: 40,
    registeredCount: 0,
    location: "Pekarangan Bapak Sugiyanto",
    scheduleDate: "2026-08-02",
    scheduleTime: "15:30",
    prizeDescription: "Piala + Uang Pembinaan",
    status: "open",
    createdAt: new Date().toISOString(),
  },
  {
    id: "c5",
    slug: "mengisi-air-tonrong",
    name: "Mengisi Air Pakai Tonrong",
    category: "dewasa",
    description: "Lomba individu ibu-ibu dan pemudi: mengisi air menggunakan tonrong (gayung tradisional).",
    ageMin: 17,
    ageMax: null,
    quota: 30,
    registeredCount: 0,
    location: "Pekarangan Bapak Sugiyanto",
    scheduleDate: "2026-08-03",
    scheduleTime: "19:00",
    prizeDescription: "Uang Tunai",
    status: "open",
    createdAt: new Date().toISOString(),
  },
  {
    id: "c6",
    slug: "voli-sarung",
    name: "Voli Pakai Sarung",
    category: "dewasa",
    description: "Lomba kelompok ibu-ibu dan pemudi: bermain voli menggunakan sarung sebagai pengganti tangan.",
    ageMin: 17,
    ageMax: null,
    quota: 50,
    registeredCount: 0,
    location: "Pekarangan Bapak Sugiyanto",
    scheduleDate: "2026-08-05",
    scheduleTime: "19:00",
    prizeDescription: "Piala + Uang Tunai",
    status: "open",
    createdAt: new Date().toISOString(),
  },
  {
    id: "c7",
    slug: "menggiring-bola-contong",
    name: "Menggiring Bola Pakai Contong",
    category: "dewasa",
    description: "Lomba individu bapak-bapak dan pemuda: menggiring bola menggunakan contong.",
    ageMin: 17,
    ageMax: null,
    quota: 30,
    registeredCount: 0,
    location: "Pekarangan Bapak Sugiyanto",
    scheduleDate: "2026-08-07",
    scheduleTime: "19:00",
    prizeDescription: "Uang Tunai",
    status: "open",
    createdAt: new Date().toISOString(),
  },
  {
    id: "c8",
    slug: "voli-net-terpal",
    name: "Voli Net Terpal",
    category: "dewasa",
    description: "Lomba kelompok bapak-bapak dan pemuda: bermain voli dengan net terpal.",
    ageMin: 17,
    ageMax: null,
    quota: 50,
    registeredCount: 0,
    location: "Pekarangan Bapak Sugiyanto",
    scheduleDate: "2026-08-10",
    scheduleTime: "19:00",
    prizeDescription: "Piala + Uang Tunai",
    status: "open",
    createdAt: new Date().toISOString(),
  },
  {
    id: "c9",
    slug: "jalan-sehat",
    name: "Jalan Sehat Bersama",
    category: "umum",
    description: "Puncak acara perayaan HUT RI ke-81. Menyusuri rute lingkungan desa bersama seluruh warga. Diakhiri dengan undian doorprize senilai Rp 15 juta!",
    ageMin: null,
    ageMax: null,
    quota: 500,
    registeredCount: 0,
    location: "Pekarangan Bapak Sugiyanto",
    scheduleDate: "2026-08-16",
    scheduleTime: "06:00",
    prizeDescription: "Doorprize senilai Rp 15.000.000",
    status: "open",
    createdAt: new Date().toISOString(),
  },
];
