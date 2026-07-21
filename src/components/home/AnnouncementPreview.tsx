// src/components/home/AnnouncementPreview.tsx
import Link from "next/link";
import { Pin, ChevronRight, Calendar } from "lucide-react";
import type { Announcement } from "@/types/announcement";
import { formatDate } from "@/utils/formatDate";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { cn } from "@/utils/cn";

interface AnnouncementPreviewProps {
  announcements: Announcement[];
}

export function AnnouncementPreview({ announcements }: AnnouncementPreviewProps) {
  if (!announcements.length) return null;

  return (
    <section className="py-20 px-5 md:px-20 bg-white" aria-label="Pengumuman terbaru">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-12 gap-4 flex-wrap">
          <SectionHeader
            title="Pengumuman Terbaru"
            eyebrow="Informasi"
            centered={false}
            accentBar
          />
          <Link
            href="/pengumuman"
            className="flex items-center gap-1 text-sm font-medium text-[#a70009] hover:underline shrink-0"
          >
            Lihat semua <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          {announcements.map((ann) => (
            <article
              key={ann.id}
              className={cn(
                "flex items-start gap-4 p-5 rounded-xl border transition-colors duration-200",
                ann.pinned
                  ? "bg-[#ffdad5] border-[#a70009]"
                  : "bg-white border-[#e5bdb8] hover:bg-[#f1f4f8]"
              )}
            >
              {ann.pinned && (
                <div
                  className="mt-0.5 shrink-0"
                  aria-label="Pengumuman disematkan"
                >
                  <Pin className="w-4 h-4 text-[#a70009] rotate-45" aria-hidden="true" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-jetbrains text-[10px] text-[#a70009] bg-[#ffdad5] px-2 py-0.5 rounded uppercase tracking-widest">
                    {ann.category}
                  </span>
                  {ann.pinned && (
                    <span className="font-jetbrains text-[10px] text-white bg-[#a70009] px-2 py-0.5 rounded uppercase tracking-widest">
                      Disematkan
                    </span>
                  )}
                </div>
                <h3 className="font-jakarta font-bold text-base text-[#181c1f] mb-1 truncate">
                  {ann.title}
                </h3>
                <p className="text-sm text-[#5c403c] line-clamp-2">{ann.content}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-[#5c403c] shrink-0 mt-0.5">
                <Calendar className="w-3 h-3" aria-hidden="true" />
                <time dateTime={ann.date}>{formatDate(ann.date, "d MMM")}</time>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
