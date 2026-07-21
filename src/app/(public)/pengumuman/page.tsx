// src/app/(public)/pengumuman/page.tsx
import { SectionHeader } from "@/components/shared/SectionHeader";
import { getAnnouncements, fallbackAnnouncements } from "@/repositories/announcementRepository";
import { formatDate } from "@/utils/formatDate";
import { Pin, Calendar, Info } from "lucide-react";
import { cn } from "@/utils/cn";

import type { Announcement } from "@/types/announcement";

export const revalidate = 300; // ISR every 5 minutes

export default async function AnnouncementsPage() {
  let announcements: Announcement[] = [];
  try {
    announcements = await getAnnouncements();
  } catch (error) {
    console.error("Failed to load announcements:", error);
    announcements = fallbackAnnouncements;
  }

  if (announcements.length === 0) {
    announcements = fallbackAnnouncements;
  }

  return (
    <div className="flex flex-col w-full py-12 space-y-12">
      {/* Header */}
      <section className="px-5 md:px-20">
        <div className="max-w-4xl mx-auto text-center">
          <SectionHeader
            title="Pengumuman Acara"
            subtitle="Informasi penting terkini seputar teknis perlombaan, rapat panitia, dan perubahan jadwal kegiatan."
            eyebrow="Pengumuman"
            accentBar
          />
        </div>
      </section>

      {/* Announcements List */}
      <section className="px-5 md:px-20 max-w-4xl mx-auto w-full">
        <div className="space-y-6">
          {announcements.map((ann) => (
            <article
              key={ann.id}
              className={cn(
                "p-6 md:p-8 rounded-xl border flex flex-col md:flex-row md:items-start gap-4 transition-all",
                ann.pinned
                  ? "bg-[#ffdad5] border-[#a70009] shadow-md"
                  : "bg-white border-[#e5bdb8]"
              )}
            >
              {/* Category & Status */}
              <div className="shrink-0 flex md:flex-col gap-2 items-start justify-between md:justify-start">
                <span className="font-jetbrains text-[10px] text-[#a70009] bg-[#ffdad5] px-2.5 py-1 rounded uppercase tracking-widest font-bold">
                  {ann.category}
                </span>
                {ann.pinned && (
                  <span className="inline-flex items-center gap-1 font-jetbrains text-[10px] text-white bg-[#a70009] px-2.5 py-1 rounded uppercase tracking-widest font-bold">
                    <Pin className="w-3.5 h-3.5 rotate-45" /> Disematkan
                  </span>
                )}
              </div>

              {/* Main Content */}
              <div className="flex-grow space-y-2">
                <h3 className="font-jakarta font-bold text-lg md:text-xl text-[#181c1f]">
                  {ann.title}
                </h3>
                <p className="text-sm md:text-base text-[#5c403c] leading-relaxed">
                  {ann.content}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-[#5c403c] pt-2">
                  <Calendar className="w-4 h-4 text-[#a70009]" />
                  <span>Diterbitkan pada {formatDate(ann.date)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
