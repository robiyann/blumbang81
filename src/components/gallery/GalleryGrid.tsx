"use client";

// src/components/gallery/GalleryGrid.tsx
import { useState } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";
import type { GalleryImage } from "@/types/gallery";
import { cn } from "@/utils/cn";
import ImageModal from "./ImageModal";

interface GalleryGridProps {
  images: GalleryImage[];
}

export function GalleryGrid({ images }: GalleryGridProps) {
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  if (!images.length) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-[#e5bdb8] shadow-xs">
        <p className="text-sm font-semibold text-[#5c403c]">Belum ada foto dokumentasi di album ini.</p>
      </div>
    );
  }

  const handleNext = () => {
    if (modalIndex !== null && modalIndex < images.length - 1) {
      setModalIndex(modalIndex + 1);
    }
  };

  const handlePrev = () => {
    if (modalIndex !== null && modalIndex > 0) {
      setModalIndex(modalIndex - 1);
    }
  };

  // Dynamic Bento Grid classes tailored for 12 items (3-column layout)
  const getBentoClass = (index: number) => {
    switch (index) {
      case 0:
        // Hero Card (2 cols x 2 rows on desktop)
        return "md:col-span-2 md:row-span-2 min-h-[280px] md:min-h-[380px]";
      case 1:
      case 2:
        // Side Highlights
        return "min-h-[180px] md:min-h-[182px]";
      default:
        // Standard Grid Cards (Items 3 to 11 = 9 cards = 3 full 3-column rows)
        return "min-h-[180px] md:min-h-[220px]";
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 auto-rows-fr">
        {images.map((img, i) => (
          <div
            key={img.id}
            onClick={() => setModalIndex(i)}
            className={cn(
              "group relative overflow-hidden rounded-2xl border border-[#e5bdb8] cursor-pointer shadow-xs bg-zinc-100 transition-all duration-300 hover:shadow-lg hover:border-[#a70009]",
              getBentoClass(i)
            )}
          >
            <Image
              src={img.url}
              alt={img.altText || "Foto dokumentasi"}
              fill
              sizes={i === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
              priority={i < 4}
              loading={i < 4 ? "eager" : "lazy"}
              fetchPriority={i < 4 ? "high" : "auto"}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              placeholder={img.blurDataUrl ? "blur" : "empty"}
              blurDataURL={img.blurDataUrl}
            />

            {/* Gradient Overlay & Hover Actions */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
              <div className="flex justify-end">
                <div className="w-9 h-9 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white border border-white/40 shadow-sm transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <ZoomIn className="w-4 h-4" />
                </div>
              </div>

              {img.altText && (
                <p className="text-white text-xs font-semibold line-clamp-2 drop-shadow-sm transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  {img.altText}
                </p>
              )}
            </div>

            {/* Hero Badge for First Item */}
            {i === 0 && (
              <div className="absolute top-3 left-3 bg-[#a70009] text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md tracking-wider uppercase">
                Unggulan
              </div>
            )}
          </div>
        ))}
      </div>

      <ImageModal
        images={images}
        currentIndex={modalIndex}
        onClose={() => setModalIndex(null)}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </>
  );
}
