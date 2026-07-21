// src/lib/db/schema.ts
import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  pgEnum,
  unique,
} from "drizzle-orm/pg-core";

// ─── Enums ────────────────────────────────────────────────
export const competitionCategoryEnum = pgEnum("competition_category", [
  "anak",
  "dewasa",
  "umum",
]);

export const competitionStatusEnum = pgEnum("competition_status", [
  "open",
  "closed",
  "full",
]);

export const registrationStatusEnum = pgEnum("registration_status", [
  "pending",
  "confirmed",
  "cancelled",
]);

export const userRoleEnum = pgEnum("user_role", ["admin", "viewer"]);

// ─── Competitions ──────────────────────────────────────────
export const competitions = pgTable("competitions", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  category: competitionCategoryEnum("category").notNull(),
  description: text("description").notNull().default(""),
  ageMin: integer("age_min"),
  ageMax: integer("age_max"),
  quota: integer("quota").notNull().default(50),
  location: text("location").notNull().default(""),
  scheduleDate: text("schedule_date"),
  scheduleTime: text("schedule_time"),
  prizeDescription: text("prize_description"),
  status: competitionStatusEnum("status").notNull().default("open"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── Registrations ─────────────────────────────────────────
export const registrations = pgTable(
  "registrations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    competitionId: uuid("competition_id")
      .notNull()
      .references(() => competitions.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    nik: text("nik").notNull(),
    phone: text("phone").notNull(),
    address: text("address").notNull(),
    age: integer("age").notNull(),
    status: registrationStatusEnum("status").notNull().default("pending"),
    registeredAt: timestamp("registered_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    // Prevent duplicate NIK per competition
    uniqueNikPerCompetition: unique().on(table.competitionId, table.nik),
  })
);

// ─── Gallery Albums ─────────────────────────────────────────
export const galleryAlbums = pgTable("gallery_albums", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  coverKey: text("cover_key"),
  category: text("category").notNull().default("umum"),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── Gallery Images ─────────────────────────────────────────
export const galleryImages = pgTable("gallery_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  albumId: uuid("album_id")
    .notNull()
    .references(() => galleryAlbums.id, { onDelete: "cascade" }),
  r2Key: text("r2_key").notNull().unique(),
  filename: text("filename").notNull(),
  altText: text("alt_text").notNull().default(""),
  width: integer("width").notNull().default(0),
  height: integer("height").notNull().default(0),
  sizeBytes: integer("size_bytes").notNull().default(0),
  blurDataUrl: text("blur_data_url"),
  isApproved: boolean("is_approved").notNull().default(false),
  takenAt: timestamp("taken_at", { withTimezone: true }),
  sortOrder: integer("sort_order").notNull().default(0),
  uploadedAt: timestamp("uploaded_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── Settings ──────────────────────────────────────────────
export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── Users (future admin) ──────────────────────────────────
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: userRoleEnum("role").notNull().default("viewer"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── Announcements ──────────────────────────────────────────
export const announcements = pgTable("announcements", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  date: text("date").notNull(), // Format "YYYY-MM-DD"
  pinned: boolean("pinned").notNull().default(false),
  category: text("category").notNull().default("Umum"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── Schedules ──────────────────────────────────────────────
export const schedules = pgTable("schedules", {
  id: uuid("id").primaryKey().defaultRandom(),
  date: text("date").notNull(), // Format "YYYY-MM-DD"
  timeStart: text("time_start").notNull().default("00:00"),
  timeEnd: text("time_end"),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  location: text("location").notNull().default("Pekarangan Bapak Sugiyanto"),
  type: text("type").notNull().default("umum"), // "anak", "dewasa", "puncak", "umum"
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── Committee Members ──────────────────────────────────────
export const committeeMembers = pgTable("committee_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  division: text("division").notNull().default("inti"), // "pimpinan", "inti", "perlombaan", "perlengkapan", etc.
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── Finance Allocations ────────────────────────────────────
export const financeAllocations = pgTable("finance_allocations", {
  id: uuid("id").primaryKey().defaultRandom(),
  percentage: integer("percentage").notNull().default(0),
  amount: integer("amount").notNull().default(0),
  label: text("label").notNull(),
  description: text("description").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── Donations ──────────────────────────────────────────────
export const donations = pgTable("donations", {
  id: uuid("id").primaryKey().defaultRandom(),
  donorName: text("donor_name").notNull(),
  amount: integer("amount").notNull(),
  donatedAt: text("donated_at").notNull(), // Format "YYYY-MM-DD"
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── Expenses ───────────────────────────────────────────────
export const expenses = pgTable("expenses", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  amount: integer("amount").notNull(),
  spentAt: text("spent_at").notNull(), // Format "YYYY-MM-DD"
  category: text("category").notNull().default("Umum"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── Type Exports ──────────────────────────────────────────
export type Competition = typeof competitions.$inferSelect;
export type NewCompetition = typeof competitions.$inferInsert;
export type Registration = typeof registrations.$inferSelect;
export type NewRegistration = typeof registrations.$inferInsert;
export type GalleryAlbum = typeof galleryAlbums.$inferSelect;
export type GalleryImage = typeof galleryImages.$inferSelect;
export type Setting = typeof settings.$inferSelect;
export type User = typeof users.$inferSelect;
export type Announcement = typeof announcements.$inferSelect;
export type NewAnnouncement = typeof announcements.$inferInsert;
export type ScheduleItem = typeof schedules.$inferSelect;
export type NewScheduleItem = typeof schedules.$inferInsert;
export type CommitteeMember = typeof committeeMembers.$inferSelect;
export type NewCommitteeMember = typeof committeeMembers.$inferInsert;
export type FinanceAllocation = typeof financeAllocations.$inferSelect;
export type NewFinanceAllocation = typeof financeAllocations.$inferInsert;
export type Donation = typeof donations.$inferSelect;
export type NewDonation = typeof donations.$inferInsert;
export type Expense = typeof expenses.$inferSelect;
export type NewExpense = typeof expenses.$inferInsert;
