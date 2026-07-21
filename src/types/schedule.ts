// src/types/schedule.ts

export type ScheduleType = "anak" | "dewasa" | "puncak" | "persiapan";

export interface ScheduleItem {
  id: string;
  date: string;
  timeStart: string;
  timeEnd: string | null;
  title: string;
  description: string;
  location: string;
  type: ScheduleType;
}

export interface ScheduleGroup {
  label: string;
  date: string;
  type: ScheduleType;
  items: ScheduleItem[];
}
