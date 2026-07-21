// src/lib/validations/registration.ts
import { z } from "zod";

export const registrationSchema = z.object({
  competitionId: z
    .string()
    .uuid("ID lomba tidak valid"),

  name: z
    .string()
    .min(3, "Nama minimal 3 karakter")
    .max(100, "Nama maksimal 100 karakter")
    .regex(/^[a-zA-Z\s'-]+$/, "Nama hanya boleh berisi huruf"),

  nik: z
    .string()
    .length(16, "NIK harus 16 digit")
    .regex(/^\d{16}$/, "NIK hanya boleh berisi angka"),

  phone: z
    .string()
    .min(10, "Nomor HP minimal 10 digit")
    .max(15, "Nomor HP maksimal 15 digit")
    .regex(/^(\+62|62|0)[0-9]{8,13}$/, "Format nomor HP tidak valid"),

  address: z
    .string()
    .min(10, "Alamat minimal 10 karakter")
    .max(300, "Alamat maksimal 300 karakter"),

  age: z
    .number({ message: "Usia harus berupa angka" })
    .int("Usia harus bilangan bulat")
    .min(1, "Usia minimal 1 tahun")
    .max(100, "Usia maksimal 100 tahun"),
});

export type RegistrationFormValues = z.infer<typeof registrationSchema>;
