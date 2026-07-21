// src/app/(public)/dokumentasi/upload/page.tsx
import { SectionHeader } from "@/components/shared/SectionHeader";
import { getGalleryAlbums } from "@/repositories/galleryRepository";
import { PublicUploadForm } from "@/components/gallery/PublicUploadForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PublicUploadPage() {
  let albums: { id: string; title: string }[] = [];
  try {
    const res = await getGalleryAlbums();
    albums = res.map((a) => ({ id: a.id, title: a.title }));
  } catch (err) {
    console.error("Failed to load albums for upload:", err);
  }

  return (
    <div className="flex flex-col w-full py-12 space-y-12">
      {/* Back button & Header */}
      <section className="px-5 md:px-20 max-w-4xl mx-auto w-full">
        <Link
          href="/dokumentasi"
          className="inline-flex items-center gap-1 text-sm font-medium text-[#a70009] hover:underline mb-6"
        >
          <ChevronLeft className="w-4 h-4" /> Kembali ke Dokumentasi
        </Link>

        <SectionHeader
          title="Kontribusi Foto Dokumentasi"
          subtitle="Punya foto seru saat kegiatan berlangsung? Unggah foto Anda di sini untuk dimasukkan ke galeri warga setelah disetujui admin."
          centered={true}
          accentBar
        />
      </section>

      {/* Form Container */}
      <section className="px-5 md:px-20 max-w-2xl mx-auto w-full">
        <PublicUploadForm albums={albums} />
      </section>
    </div>
  );
}
