// src/app/admin/page.tsx
import { db, schema } from "@/lib/db";
import { checkSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { getPendingImagesAction } from "@/app/actions/gallery";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const isAuthenticated = await checkSession();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  let announcements: any[] = [];
  let schedules: any[] = [];
  let committeeMembers: any[] = [];
  let financeAllocations: any[] = [];
  let donations: any[] = [];
  let expenses: any[] = [];
  let pendingImages: any[] = [];

  try {
    if (db) {
      const [annRes, schedRes, commRes, finRes, donRes, expRes, pendRes] = await Promise.all([
        db.select().from(schema.announcements),
        db.select().from(schema.schedules),
        db.select().from(schema.committeeMembers),
        db.select().from(schema.financeAllocations),
        db.select().from(schema.donations),
        db.select().from(schema.expenses),
        getPendingImagesAction(),
      ]);

      announcements = annRes.sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      schedules = schedRes.sort((a, b) => a.date.localeCompare(b.date));
      committeeMembers = commRes.sort((a, b) => a.sortOrder - b.sortOrder);
      financeAllocations = finRes;
      donations = donRes.sort((a, b) => b.donatedAt.localeCompare(a.donatedAt));
      expenses = expRes.sort((a, b) => b.spentAt.localeCompare(a.spentAt));
      pendingImages = pendRes;
    }
  } catch (error) {
    console.error("Failed to load admin dashboard tables:", error);
  }

  return (
    <AdminDashboard
      initialAnnouncements={announcements}
      initialSchedules={schedules}
      initialCommittee={committeeMembers}
      initialFinance={financeAllocations}
      initialDonations={donations}
      initialExpenses={expenses}
      initialPendingImages={pendingImages}
    />
  );
}
