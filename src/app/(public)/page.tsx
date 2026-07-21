// src/app/(public)/page.tsx
import { HeroSection } from "@/components/home/HeroSection";
import { VisionStatement } from "@/components/home/VisionStatement";
import { ThreePillars } from "@/components/home/ThreePillars";
import { ThemeOrbital } from "@/components/home/ThemeOrbital";
import { DonationCTA } from "@/components/home/DonationCTA";
import { AnnouncementPreview } from "@/components/home/AnnouncementPreview";
import CountdownTimer from "@/components/home/CountdownTimer";
import { getLatestAnnouncements, fallbackAnnouncements } from "@/repositories/announcementRepository";
import { getFeaturedFlashbackImages } from "@/repositories/galleryRepository";
import { SectionHeader } from "@/components/shared/SectionHeader";
import Link from "next/link";
import Image from "next/image";

import type { Announcement } from "@/types/announcement";

export const revalidate = 300; // ISR every 5 minutes

export default async function HomePage() {
  // Fetch real announcements or use fallback seed
  let announcements: Announcement[] = [];
  try {
    announcements = await getLatestAnnouncements(3);
  } catch (error) {
    console.error("Failed to load announcements:", error);
    announcements = fallbackAnnouncements.slice(0, 3);
  }

  if (announcements.length === 0) {
    announcements = fallbackAnnouncements.slice(0, 3);
  }

  const flashbackImages = await getFeaturedFlashbackImages();
  const photoWargaSrc = flashbackImages[0] || "/jalan.webp";
  const photoPanitiaSrc = flashbackImages[1] || "/panitia.webp";

  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <HeroSection />

      {/* Countdown banner */}
      <section className="bg-white border-y border-[#e5bdb8] py-12 px-5 md:px-20 text-center relative z-10">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <SectionHeader
            title="Menuju Hari Kemerdekaan"
            eyebrow="Hitung Mundur"
            centered
            className="mb-8"
          />
          <CountdownTimer />
        </div>
      </section>

      {/* Vision Statement */}
      <VisionStatement />

      {/* Announcement Preview */}
      <AnnouncementPreview announcements={announcements} />

      {/* Three Pillars */}
      <ThreePillars />

      {/* Theme Orbital */}
      <ThemeOrbital />

      {/* Flashback Section */}
      <section className="py-24 px-5 md:px-20 bg-white overflow-hidden relative">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/3">
            <SectionHeader
              title="Kilas Balik Semarak Kemerdekaan"
              eyebrow="Dokumentasi"
              centered={false}
              accentBar
              className="mb-6"
            />
            <p className="text-base text-[#5c403c] leading-relaxed mb-6">
              Antusiasme dan partisipasi luar biasa dari warga Blumbang RT 15 pada penyelenggaraan tahun-tahun sebelumnya menjadi pondasi optimisme dan standar kualitas kami untuk perayaan tahun ini.
            </p>
            <Link
              href="/dokumentasi"
              className="inline-flex items-center gap-2 bg-[#a70009] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#930006] transition-colors"
            >
              Lihat Galeri Foto
            </Link>
          </div>
          <div className="md:w-2/3 relative h-[380px] w-full flex items-center justify-center">
            {/* Overlapping photos from R2 gallery or local fallback */}
            <div className="absolute top-0 right-0 w-2/3 h-52 md:h-64 bg-[#ebeef2] p-2.5 rounded-2xl shadow-xl border border-[#e5bdb8] rotate-2 z-10 hover:rotate-0 transition-transform duration-300">
              <div className="w-full h-full relative rounded-xl overflow-hidden bg-zinc-200">
                <Image
                  src={photoWargaSrc}
                  alt="Kegiatan Keramaian Warga Blumbang"
                  fill
                  sizes="(max-width: 768px) 60vw, 40vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-2/3 h-52 md:h-64 bg-[#ebeef2] p-2.5 rounded-2xl shadow-xl border border-[#e5bdb8] -rotate-3 z-20 hover:rotate-0 transition-transform duration-300">
              <div className="w-full h-full relative rounded-xl overflow-hidden bg-zinc-200">
                <Image
                  src={photoPanitiaSrc}
                  alt="Dokumentasi Panitia HUT RI Blumbang"
                  fill
                  sizes="(max-width: 768px) 60vw, 40vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Donation CTA */}
      <DonationCTA />
    </div>
  );
}
export { generatePageMetadata } from "@/utils/generateMetadata";
