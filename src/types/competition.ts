// src/types/competition.ts

export type CompetitionCategory = "anak" | "dewasa" | "umum";
export type CompetitionStatus = "open" | "closed" | "full";

export interface Competition {
  id: string;
  slug: string;
  name: string;
  category: CompetitionCategory;
  description: string;
  ageMin: number | null;
  ageMax: number | null;
  quota: number;
  registeredCount: number;
  location: string;
  scheduleDate: string | null;
  scheduleTime: string | null;
  prizeDescription: string | null;
  status: CompetitionStatus;
  createdAt: string;
}

export interface CompetitionFilter {
  category?: CompetitionCategory;
  status?: CompetitionStatus;
}
