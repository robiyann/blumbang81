"use server";

// src/actions/register.ts
import { db } from "@/lib/db";
import { competitions, registrations } from "@/lib/db/schema";
import { registrationSchema } from "@/lib/validations/registration";
import { eq, count } from "drizzle-orm";
import type { RegistrationResult } from "@/types/registration";

/**
 * Server Action: Register a user for a competition.
 *
 * Validates input with Zod, checks for duplicates and quota,
 * then persists to Neon via Drizzle.
 */
export async function registerForCompetition(
  formData: unknown
): Promise<RegistrationResult> {
  // 1. Validate input
  const parsed = registrationSchema.safeParse(formData);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return {
      success: false,
      error: firstError.message,
      field: firstError.path[0] as string,
    };
  }

  const { competitionId, name, nik, phone, address, age } = parsed.data;

  if (!db) {
    // Dev mode without DB
    console.warn("[register] DB not configured — simulating success");
    return { success: true, registrationId: "dev-mode-id" };
  }

  try {
    // 2. Verify competition exists and is open
    const [competition] = await db
      .select({ id: competitions.id, status: competitions.status, quota: competitions.quota })
      .from(competitions)
      .where(eq(competitions.id, competitionId))
      .limit(1);

    if (!competition) {
      return { success: false, error: "Lomba tidak ditemukan." };
    }
    if (competition.status !== "open") {
      return { success: false, error: "Pendaftaran untuk lomba ini sudah ditutup." };
    }

    // 3. Check quota
    const [{ registeredCount }] = await db
      .select({ registeredCount: count(registrations.id) })
      .from(registrations)
      .where(eq(registrations.competitionId, competitionId));

    if (registeredCount >= competition.quota) {
      // Auto-close competition
      await db
        .update(competitions)
        .set({ status: "full" })
        .where(eq(competitions.id, competitionId));
      return { success: false, error: "Kuota lomba ini sudah penuh." };
    }

    // 4. Insert registration (DB UNIQUE constraint will catch duplicates)
    const [inserted] = await db
      .insert(registrations)
      .values({ competitionId, name, nik, phone, address, age })
      .returning({ id: registrations.id });

    return { success: true, registrationId: inserted.id };
  } catch (error: unknown) {
    // PostgreSQL unique violation = duplicate NIK
    if (
      error instanceof Error &&
      error.message.includes("unique constraint")
    ) {
      return {
        success: false,
        error: "NIK ini sudah terdaftar untuk lomba yang dipilih.",
        field: "nik",
      };
    }
    console.error("[register] Unexpected error:", error);
    return { success: false, error: "Terjadi kesalahan. Silakan coba lagi." };
  }
}
