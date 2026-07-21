// src/types/committee.ts

export type CommitteeDivision =
  | "perlombaan"
  | "perlengkapan"
  | "konsumsi"
  | "dana"
  | "keamanan"
  | "humas"
  | "dokumentasi";

export interface CommitteeMember {
  id: string;
  name: string;
  role: string;
  division: CommitteeDivision | "inti" | "pimpinan";
  sortOrder: number;
}

export interface CommitteeDivisionGroup {
  division: string;
  label: string;
  members: CommitteeMember[];
}
