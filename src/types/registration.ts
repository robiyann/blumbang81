// src/types/registration.ts

export interface RegistrationInput {
  competitionId: string;
  name: string;
  nik: string;
  phone: string;
  address: string;
  age: number;
}

export interface Registration {
  id: string;
  competitionId: string;
  competitionName: string;
  name: string;
  nik: string;
  phone: string;
  address: string;
  age: number;
  status: "pending" | "confirmed" | "cancelled";
  registeredAt: string;
}

export type RegistrationResult =
  | { success: true; registrationId: string }
  | { success: false; error: string; field?: string };
