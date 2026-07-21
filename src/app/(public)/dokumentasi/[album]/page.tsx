// src/app/(public)/dokumentasi/[album]/page.tsx
import { SectionHeader } from "@/components/shared/SectionHeader";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { getAlbumImages, GALLERY_PAGE_SIZE } from "@/repositories/galleryRepository";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cn } from "@/utils/cn";

export const revalidate = 600; // ISR every 10 minutes

interface AlbumDetailPageProps {
  params: Promise<{
    album: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

// Helper to generate pagination page range
function getPageRange(current: number, total: number) {
  const pages: (number | string)[] = [];
  const range = 1; // Number of pages to show around current page

  for (let i = 1; i <= total; i++) {
    if (
      i === 1 || 
      i === total || 
      (i >= current - range && i <= current + range)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }
  return pages;
}

export default async function AlbumDetailPage({ params, searchParams }: AlbumDetailPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const albumSlug = resolvedParams.album;
  const currentPage = parseInt(resolvedSearchParams.page || "1", 10) || 1;

  let data = null;
  try {
    data = await getAlbumImages(albumSlug, currentPage);
  } catch (error) {
    console.error("Failed to load album images:", error);
  }

  if (!data || !data.album) {
    return notFound();
  }

  const { images, album, total } = data;
  const totalPages = Math.ceil(total / GALLERY_PAGE_SIZE);

  return (
    <div className="flex flex-col w-full py-12 space-y-12">
      {/* Back button & Header */}
      <section className="px-5 md:px-20 max-w-6xl mx-auto w-full">
        <Link
          href="/dokumentasi"
          className="inline-flex items-center gap-1 text-sm font-medium text-[#a70009] hover:underline mb-6"
        >
          <ChevronLeft className="w-4 h-4" /> Kembali ke Album
        </Link>

        <SectionHeader
          title={album.title}
          subtitle={album.description || ""}
          centered={false}
          accentBar
        />
      </section>

      {/* Grid */}
      <section className="px-5 md:px-20 max-w-6xl mx-auto w-full">
        <GalleryGrid images={images} />
        
        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t border-[#ebeef2] w-full">
            
            {/* Prev Button */}
            {currentPage > 1 ? (
              <Link
                href={`/dokumentasi/${albumSlug}?page=${currentPage - 1}`}
                className="w-full sm:w-auto px-4 py-2 border-2 border-[#e5bdb8] rounded-xl text-xs font-extrabold text-[#5c403c] hover:bg-[#ffdad5]/40 hover:text-[#a70009] hover:border-[#a70009]/40 transition-all duration-200 text-center flex items-center justify-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Sebelumnya
              </Link>
            ) : (
              <span className="w-full sm:w-auto px-4 py-2 border border-zinc-200 rounded-xl text-xs font-extrabold text-zinc-300 pointer-events-none select-none text-center flex items-center justify-center gap-1">
                <ChevronLeft className="w-4 h-4" /> Sebelumnya
              </span>
            )}
            
            {/* Numeric Page List */}
            <div className="flex items-center gap-1.5 flex-wrap justify-center my-2 sm:my-0">
              {getPageRange(currentPage, totalPages).map((p, idx) => {
                if (p === "...") {
                  return (
                    <span
                      key={`ellipsis-${idx}`}
                      className="w-9 h-9 flex items-center justify-center text-xs font-bold text-[#5c403c]/40 select-none"
                    >
                      ...
                    </span>
                  );
                }
                const isPageActive = p === currentPage;
                return (
                  <Link
                    key={`page-${p}`}
                    href={`/dokumentasi/${albumSlug}?page=${p}`}
                    className={cn(
                      "w-9 h-9 flex items-center justify-center rounded-xl text-xs font-black transition-all duration-200 border-2",
                      isPageActive
                        ? "bg-[#a70009] border-[#a70009] text-white shadow-sm"
                        : "border-[#e5bdb8] text-[#5c403c] hover:bg-[#ffdad5]/40 hover:text-[#a70009] hover:border-[#a70009]"
                    )}
                  >
                    {p}
                  </Link>
                );
              })}
            </div>

            {/* Next Button */}
            {currentPage < totalPages ? (
              <Link
                href={`/dokumentasi/${albumSlug}?page=${currentPage + 1}`}
                className="w-full sm:w-auto px-4 py-2 border-2 border-[#e5bdb8] rounded-xl text-xs font-extrabold text-[#5c403c] hover:bg-[#ffdad5]/40 hover:text-[#a70009] hover:border-[#a70009]/40 transition-all duration-200 text-center flex items-center justify-center gap-1"
              >
                Berikutnya <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <span className="w-full sm:w-auto px-4 py-2 border border-zinc-200 rounded-xl text-xs font-extrabold text-zinc-300 pointer-events-none select-none text-center flex items-center justify-center gap-1">
                Berikutnya <ChevronRight className="w-4 h-4" />
              </span>
            )}
            
          </div>
        )}
      </section>
    </div>
  );
}
