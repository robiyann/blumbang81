// src/app/layout.tsx
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HUT Kemerdekaan RI ke-81 — Blumbang RT 15",
  description:
    "Peringatan HUT Kemerdekaan Republik Indonesia ke-81 Tahun 2026. Blumbang RT 15, Desa Saren, Kec. Kalijambe, Kab. Sragen. Semangat Gotong Royong Lintas Generasi.",
  keywords: ["HUT RI 81", "Kemerdekaan", "Blumbang RT 15", "Saren", "Kalijambe", "Sragen", "Proposal", "Kegiatan"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased flex flex-col min-h-screen pt-20 bg-background text-on-background">
        <Navbar />
        <main className="flex-grow flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
