// src/app/(public)/dokumentasi/page.tsx
import { SectionHeader } from "@/components/shared/SectionHeader";
import { getGalleryAlbums } from "@/repositories/galleryRepository";
import Link from "next/link";
import Image from "next/image";
import { Folder, Image as ImageIcon, UploadCloud } from "lucide-react";

import type { GalleryAlbum } from "@/types/gallery";

export const revalidate = 600; // ISR every 10 minutes

export default async function DocumentationPage() {
  let albums: GalleryAlbum[] = [];
  try {
    albums = await getGalleryAlbums();
  } catch (error) {
    console.error("Failed to load gallery albums:", error);
  }

  return (
    <div className="flex flex-col w-full py-12 space-y-12">
      {/* Header */}
      <section className="px-5 md:px-20">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <SectionHeader
            title="Dokumentasi Kegiatan"
            subtitle="Galeri album foto perayaan HUT RI dari tahun ke tahun yang diabadikan oleh tim dokumentasi."
            eyebrow="Galeri Foto"
            accentBar
          />
          <div className="mt-6">
            <Link
              href="/dokumentasi/upload"
              className="inline-flex items-center gap-2 bg-[#a70009] text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-xl hover:bg-[#930006] active:scale-95 transition-all duration-200 shadow-md"
            >
              <UploadCloud className="w-4.5 h-4.5" /> Kontribusi / Unggah Foto Anda
            </Link>
          </div>
        </div>
      </section>

      {/* Albums Grid */}
      <section className="px-5 md:px-20 max-w-6xl mx-auto w-full">
        {albums.length === 0 ? (
          <div className="text-center py-16 bg-white border border-[#e5bdb8] rounded-xl p-8 max-w-md mx-auto shadow-sm">
            <Folder className="w-12 h-12 text-[#a70009]/40 mx-auto mb-3" />
            <p className="text-sm font-semibold text-[#5c403c]">Belum ada album dokumentasi yang diterbitkan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {albums.map((album, index) => (
              <Link
                key={album.id}
                href={`/dokumentasi/${album.slug}`}
                className="bg-white rounded-xl border border-[#e5bdb8] border-t-4 border-t-[#a70009] shadow-card hover:shadow-card-hover transition-all duration-300 group overflow-hidden flex flex-col"
              >
                {/* Cover Image Placeholder */}
                <div className="h-48 w-full relative bg-zinc-200 flex items-center justify-center overflow-hidden">
                  {album.coverUrl ? (
                    <Image
                      src={album.coverUrl}
                      alt={album.title}
                      fill
                      priority={index === 0}
                      loading={index === 0 ? "eager" : "lazy"}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <Folder className="w-16 h-16 text-[#a70009]/40" />
                  )}
                  <div className="absolute top-3 right-3 bg-black/60 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5" />
                    {album.imageCount} Foto
                  </div>
                </div>

                {/* Title & Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="font-jetbrains text-[9px] uppercase tracking-widest text-[#a70009] bg-[#ffdad5] px-2 py-0.5 rounded">
                      {album.category}
                    </span>
                    <h3 className="font-jakarta font-bold text-lg text-[#181c1f] mt-3 group-hover:text-[#a70009] transition-colors line-clamp-1">
                      {album.title}
                    </h3>
                    {album.description && (
                      <p className="text-xs text-[#5c403c] leading-relaxed line-clamp-2 mt-2">
                        {album.description}
                      </p>
                    )}
                  </div>
                  <div className="pt-4 mt-4 border-t border-[#ebeef2] text-xs font-semibold text-[#a70009] flex items-center gap-1">
                    Buka Album &rarr;
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
