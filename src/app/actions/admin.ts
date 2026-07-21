// src/app/actions/admin.ts
"use server";

import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { checkSession, createSession, deleteSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { overwriteSheet } from "@/lib/sheets/client";

// [SEC] Hard error on missing credentials — never fall back to defaults in any environment
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
  throw new Error(
    "[auth] ADMIN_USERNAME and ADMIN_PASSWORD environment variables must be set. "
    + "Do not run without them — there is no default fallback."
  );
}

// ─── LOGIN / SESSION ACTIONS ────────────────────────────────
export async function loginAction(prevState: any, formData: FormData) {
  const username = formData.get("username")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!username || !password) {
    return { success: false, error: "Username dan password wajib diisi!" };
  }

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    await createSession();
    return { success: true };
  }

  return { success: false, error: "Username atau password salah!" };
}

export async function logoutAction() {
  await deleteSession();
  revalidatePath("/");
  revalidatePath("/pengumuman");
  revalidatePath("/jadwal");
  revalidatePath("/panitia");
  revalidatePath("/keuangan");
}

// ─── BACKUP SYNC HELPERS ────────────────────────────────────

async function syncAnnouncementsToSheets() {
  try {
    const list = await db.select().from(schema.announcements);
    const headers = ["id", "title", "content", "date", "pinned", "category"];
    const sorted = list.sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    const rows = sorted.map((a) => [a.id, a.title, a.content, a.date, String(a.pinned), a.category]);
    await overwriteSheet("pengumuman!A1", [headers, ...rows]);
  } catch (err) {
    console.error("[sheets] Sync announcements failed:", err);
  }
}

async function syncSchedulesToSheets() {
  try {
    const list = await db.select().from(schema.schedules);
    const headers = ["date", "timeStart", "timeEnd", "title", "description", "location", "type"];
    const sorted = list.sort((a, b) => a.date.localeCompare(b.date));
    const rows = sorted.map((s) => [s.date, s.timeStart, s.timeEnd || "", s.title, s.description, s.location, s.type]);
    await overwriteSheet("jadwal!A1", [headers, ...rows]);
  } catch (err) {
    console.error("[sheets] Sync schedules failed:", err);
  }
}

async function syncCommitteeToSheets() {
  try {
    const list = await db.select().from(schema.committeeMembers);
    const headers = ["name", "role", "division", "sortOrder"];
    const sorted = list.sort((a, b) => a.sortOrder - b.sortOrder);
    const rows = sorted.map((c) => [c.name, c.role, c.division, String(c.sortOrder)]);
    await overwriteSheet("panitia!A1", [headers, ...rows]);
  } catch (err) {
    console.error("[sheets] Sync committee failed:", err);
  }
}

async function syncFinanceToSheets() {
  try {
    const list = await db.select().from(schema.financeAllocations);
    const headers = ["percentage", "amount", "label", "description"];
    const rows = list.map((f) => [String(f.percentage), String(f.amount), f.label, f.description]);
    await overwriteSheet("keuangan!A1", [headers, ...rows]);
  } catch (err) {
    console.error("[sheets] Sync finance failed:", err);
  }
}

async function syncDonationsToSheets() {
  try {
    const list = await db.select().from(schema.donations);
    const headers = ["id", "donorName", "amount", "donatedAt"];
    const sorted = list.sort((a, b) => b.donatedAt.localeCompare(a.donatedAt));
    const rows = sorted.map((d) => [d.id, d.donorName, String(d.amount), d.donatedAt]);
    await overwriteSheet("donatur!A1", [headers, ...rows]);
  } catch (err) {
    console.error("[sheets] Sync donations failed:", err);
  }
}

async function syncExpensesToSheets() {
  try {
    const list = await db.select().from(schema.expenses);
    const headers = ["id", "title", "amount", "spentAt", "category"];
    const sorted = list.sort((a, b) => b.spentAt.localeCompare(a.spentAt));
    const rows = sorted.map((e) => [e.id, e.title, String(e.amount), e.spentAt, e.category]);
    await overwriteSheet("pengeluaran!A1", [headers, ...rows]);
  } catch (err) {
    console.error("[sheets] Sync expenses failed:", err);
  }
}

// ─── ANNOUNCEMENTS ACTIONS ──────────────────────────────────
export async function createAnnouncementAction(title: string, content: string, category = "Umum", pinned = false) {
  const isAuth = await checkSession();
  if (!isAuth) throw new Error("Unauthorized");
  if (!title || !content) return { success: false, error: "Judul dan isi wajib diisi!" };

  try {
    await db.insert(schema.announcements).values({
      title,
      content,
      category,
      pinned,
      date: new Date().toISOString().split("T")[0],
    });
    await syncAnnouncementsToSheets();
    revalidatePath("/");
    revalidatePath("/pengumuman");
    return { success: true };
  } catch (err) {
    return { success: false, error: "Gagal menyimpan ke DB." };
  }
}

export async function deleteAnnouncementAction(id: string) {
  const isAuth = await checkSession();
  if (!isAuth) throw new Error("Unauthorized");

  try {
    await db.delete(schema.announcements).where(eq(schema.announcements.id, id));
    await syncAnnouncementsToSheets();
    revalidatePath("/");
    revalidatePath("/pengumuman");
    return { success: true };
  } catch (err) {
    return { success: false, error: "Gagal menghapus dari DB." };
  }
}

export async function updateAnnouncementAction(
  id: string,
  title: string,
  content: string,
  category: string,
  pinned: boolean
) {
  const isAuth = await checkSession();
  if (!isAuth) throw new Error("Unauthorized");
  if (!id || !title || !content) return { success: false, error: "ID, judul, dan isi wajib diisi!" };

  try {
    await db
      .update(schema.announcements)
      .set({ title, content, category, pinned })
      .where(eq(schema.announcements.id, id));
    await syncAnnouncementsToSheets();
    revalidatePath("/");
    revalidatePath("/pengumuman");
    return { success: true };
  } catch (err) {
    return { success: false, error: "Gagal memperbarui pengumuman." };
  }
}

// ─── SCHEDULE ACTIONS ───────────────────────────────────────
export async function createScheduleAction(
  date: string,
  timeStart: string,
  timeEnd: string | null,
  title: string,
  description: string,
  location: string,
  type: string
) {
  const isAuth = await checkSession();
  if (!isAuth) throw new Error("Unauthorized");
  if (!date || !title) return { success: false, error: "Tanggal dan judul wajib diisi!" };

  try {
    await db.insert(schema.schedules).values({
      date,
      timeStart,
      timeEnd,
      title,
      description,
      location,
      type,
    });
    await syncSchedulesToSheets();
    revalidatePath("/jadwal");
    return { success: true };
  } catch (err) {
    return { success: false, error: "Gagal menyimpan jadwal." };
  }
}

export async function deleteScheduleAction(id: string) {
  const isAuth = await checkSession();
  if (!isAuth) throw new Error("Unauthorized");

  try {
    await db.delete(schema.schedules).where(eq(schema.schedules.id, id));
    await syncSchedulesToSheets();
    revalidatePath("/jadwal");
    return { success: true };
  } catch (err) {
    return { success: false, error: "Gagal menghapus jadwal." };
  }
}

export async function updateScheduleAction(
  id: string,
  date: string,
  timeStart: string,
  timeEnd: string | null,
  title: string,
  description: string,
  location: string,
  type: string
) {
  const isAuth = await checkSession();
  if (!isAuth) throw new Error("Unauthorized");
  if (!id || !date || !title) return { success: false, error: "ID, tanggal, dan judul wajib diisi!" };

  try {
    await db
      .update(schema.schedules)
      .set({ date, timeStart, timeEnd, title, description, location, type })
      .where(eq(schema.schedules.id, id));
    await syncSchedulesToSheets();
    revalidatePath("/jadwal");
    return { success: true };
  } catch (err) {
    return { success: false, error: "Gagal memperbarui jadwal." };
  }
}

// ─── COMMITTEE ACTIONS ──────────────────────────────────────
export async function createCommitteeAction(name: string, role: string, division = "inti", sortOrder = 0) {
  const isAuth = await checkSession();
  if (!isAuth) throw new Error("Unauthorized");
  if (!name || !role) return { success: false, error: "Nama dan jabatan wajib diisi!" };

  try {
    await db.insert(schema.committeeMembers).values({
      name,
      role,
      division,
      sortOrder,
    });
    await syncCommitteeToSheets();
    revalidatePath("/panitia");
    return { success: true };
  } catch (err) {
    return { success: false, error: "Gagal menambah panitia." };
  }
}

export async function deleteCommitteeAction(id: string) {
  const isAuth = await checkSession();
  if (!isAuth) throw new Error("Unauthorized");

  try {
    await db.delete(schema.committeeMembers).where(eq(schema.committeeMembers.id, id));
    await syncCommitteeToSheets();
    revalidatePath("/panitia");
    return { success: true };
  } catch (err) {
    return { success: false, error: "Gagal menghapus panitia." };
  }
}

export async function updateCommitteeAction(
  id: string,
  name: string,
  role: string,
  division: string,
  sortOrder: number
) {
  const isAuth = await checkSession();
  if (!isAuth) throw new Error("Unauthorized");
  if (!id || !name || !role) return { success: false, error: "ID, nama, dan jabatan wajib diisi!" };

  try {
    await db
      .update(schema.committeeMembers)
      .set({ name, role, division, sortOrder })
      .where(eq(schema.committeeMembers.id, id));
    await syncCommitteeToSheets();
    revalidatePath("/panitia");
    return { success: true };
  } catch (err) {
    return { success: false, error: "Gagal memperbarui data panitia." };
  }
}

// ─── FINANCE RAB ACTIONS ────────────────────────────────────
export async function createFinanceAction(percentage: number, amount: number, label: string, description: string) {
  const isAuth = await checkSession();
  if (!isAuth) throw new Error("Unauthorized");
  if (!label || !amount) return { success: false, error: "Label dan nominal wajib diisi!" };

  try {
    await db.insert(schema.financeAllocations).values({
      percentage,
      amount,
      label,
      description,
    });
    await syncFinanceToSheets();
    revalidatePath("/keuangan");
    return { success: true };
  } catch (err) {
    return { success: false, error: "Gagal menambah alokasi RAB." };
  }
}

export async function deleteFinanceAction(id: string) {
  const isAuth = await checkSession();
  if (!isAuth) throw new Error("Unauthorized");

  try {
    await db.delete(schema.financeAllocations).where(eq(schema.financeAllocations.id, id));
    await syncFinanceToSheets();
    revalidatePath("/keuangan");
    return { success: true };
  } catch (err) {
    return { success: false, error: "Gagal menghapus alokasi RAB." };
  }
}

export async function updateFinanceAction(
  id: string,
  percentage: number,
  amount: number,
  label: string,
  description: string
) {
  const isAuth = await checkSession();
  if (!isAuth) throw new Error("Unauthorized");
  if (!id || !label || !amount) return { success: false, error: "ID, label, dan nominal wajib diisi!" };

  try {
    await db
      .update(schema.financeAllocations)
      .set({ percentage, amount, label, description })
      .where(eq(schema.financeAllocations.id, id));
    await syncFinanceToSheets();
    revalidatePath("/keuangan");
    return { success: true };
  } catch (err) {
    return { success: false, error: "Gagal memperbarui alokasi RAB." };
  }
}

// ─── DONATION ACTIONS ───────────────────────────────────────
export async function createDonationAction(donorName: string, amount: number, donatedAt: string) {
  const isAuth = await checkSession();
  if (!isAuth) throw new Error("Unauthorized");
  if (!donorName || !amount || !donatedAt) return { success: false, error: "Semua form donasi wajib diisi!" };

  try {
    await db.insert(schema.donations).values({
      donorName,
      amount,
      donatedAt,
    });
    await syncDonationsToSheets();
    revalidatePath("/keuangan");
    return { success: true };
  } catch (err) {
    return { success: false, error: "Gagal menyimpan donasi." };
  }
}

export async function deleteDonationAction(id: string) {
  const isAuth = await checkSession();
  if (!isAuth) throw new Error("Unauthorized");

  try {
    await db.delete(schema.donations).where(eq(schema.donations.id, id));
    await syncDonationsToSheets();
    revalidatePath("/keuangan");
    return { success: true };
  } catch (err) {
    return { success: false, error: "Gagal menghapus donasi." };
  }
}

export async function updateDonationAction(
  id: string,
  donorName: string,
  amount: number,
  donatedAt: string
) {
  const isAuth = await checkSession();
  if (!isAuth) throw new Error("Unauthorized");
  if (!id || !donorName || !amount || !donatedAt) return { success: false, error: "Semua field wajib diisi!" };

  try {
    await db
      .update(schema.donations)
      .set({ donorName, amount, donatedAt })
      .where(eq(schema.donations.id, id));
    await syncDonationsToSheets();
    revalidatePath("/keuangan");
    return { success: true };
  } catch (err) {
    return { success: false, error: "Gagal memperbarui data donatur." };
  }
}

// ─── EXPENSE ACTIONS ────────────────────────────────────────
export async function createExpenseAction(title: string, amount: number, spentAt: string, category = "Umum") {
  const isAuth = await checkSession();
  if (!isAuth) throw new Error("Unauthorized");
  if (!title || !amount || !spentAt) return { success: false, error: "Semua form pengeluaran wajib diisi!" };

  try {
    await db.insert(schema.expenses).values({
      title,
      amount,
      spentAt,
      category,
    });
    await syncExpensesToSheets();
    revalidatePath("/keuangan");
    return { success: true };
  } catch (err) {
    return { success: false, error: "Gagal menyimpan pengeluaran." };
  }
}

export async function deleteExpenseAction(id: string) {
  const isAuth = await checkSession();
  if (!isAuth) throw new Error("Unauthorized");

  try {
    await db.delete(schema.expenses).where(eq(schema.expenses.id, id));
    await syncExpensesToSheets();
    revalidatePath("/keuangan");
    return { success: true };
  } catch (err) {
    return { success: false, error: "Gagal menghapus pengeluaran." };
  }
}

export async function updateExpenseAction(
  id: string,
  title: string,
  amount: number,
  spentAt: string,
  category: string
) {
  const isAuth = await checkSession();
  if (!isAuth) throw new Error("Unauthorized");
  if (!id || !title || !amount || !spentAt) return { success: false, error: "Semua field wajib diisi!" };

  try {
    await db
      .update(schema.expenses)
      .set({ title, amount, spentAt, category })
      .where(eq(schema.expenses.id, id));
    await syncExpensesToSheets();
    revalidatePath("/keuangan");
    return { success: true };
  } catch (err) {
    return { success: false, error: "Gagal memperbarui pengeluaran." };
  }
}
