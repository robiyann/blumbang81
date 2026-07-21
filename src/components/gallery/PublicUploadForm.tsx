// src/components/gallery/PublicUploadForm.tsx
"use client";

import { useState, useRef } from "react";
import { uploadPublicImageAction } from "@/app/actions/gallery";
import { UploadCloud, Image as ImageIcon, CheckCircle, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/cn";

interface PublicUploadFormProps {
  albums: { id: string; title: string }[];
}

export function PublicUploadForm({ albums }: PublicUploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [contributorName, setContributorName] = useState("");
  const [selectedAlbumId, setSelectedAlbumId] = useState(albums[0]?.id || "");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Client-side validations
    if (!file.type.startsWith("image/")) {
      setError("Hanya file gambar/foto yang diperbolehkan.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran file foto terlalu besar. Batas maksimal adalah 5MB.");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setError(null);
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    if (!file.type.startsWith("image/")) {
      setError("Hanya file gambar/foto yang diperbolehkan.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran file foto terlalu besar. Batas maksimal adalah 5MB.");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Silakan pilih file foto terlebih dahulu.");
      return;
    }
    if (!selectedAlbumId) {
      setError("Silakan pilih album tujuan.");
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("albumId", selectedAlbumId);
      formData.append("contributorName", contributorName || "Warga");

      const res = await uploadPublicImageAction(formData);

      if (res.success) {
        setSuccess(true);
        setSelectedFile(null);
        setPreviewUrl(null);
        setContributorName("");
      } else {
        setError(res.error || "Gagal mengunggah foto.");
      }
    } catch (err: any) {
      setError("Terjadi kesalahan sistem. Silakan coba kembali.");
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (success) {
    return (
      <div className="bg-white rounded-2xl border border-[#e5bdb8] p-8 text-center shadow-card space-y-6 animate-in fade-in zoom-in duration-200">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="font-jakarta font-black text-xl text-[#181c1f]">Foto Berhasil Dikirim!</h3>
          <p className="text-xs text-[#5c403c] leading-relaxed max-w-sm mx-auto">
            Terima kasih atas kontribusi Anda. Foto Anda telah masuk ke dalam antrean persetujuan panitia dan akan muncul di galeri setelah disetujui oleh admin.
          </p>
        </div>
        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => setSuccess(false)}
            className="px-5 py-3 bg-[#a70009] text-white text-xs font-bold rounded-xl hover:bg-[#930006] transition-colors"
          >
            Kirim Foto Lain
          </button>
          <Link
            href="/dokumentasi"
            className="px-5 py-3 border border-[#e5bdb8] text-[#5c403c] text-xs font-bold rounded-xl hover:bg-[#ffdad5]/40 transition-colors flex items-center justify-center gap-1.5"
          >
            Kembali ke Galeri
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#e5bdb8] p-6 sm:p-8 shadow-card space-y-6">
      {error && (
        <div className="p-4 bg-[#ffdad5] border-l-4 border-[#a70009] rounded-lg text-xs text-[#a70009] flex gap-2.5 items-center">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {/* contributor name */}
      <div className="space-y-1.5">
        <label className="block font-jakarta font-bold text-[10px] text-[#181c1f] uppercase tracking-wide">
          Nama Anda / Nama Pengambil Foto
        </label>
        <input
          type="text"
          value={contributorName}
          onChange={(e) => setContributorName(e.target.value)}
          placeholder="Contoh: Budi Santoso (Opsional)"
          className="w-full px-4 py-3 rounded-xl border border-[#e5bdb8] text-sm bg-[#f7fafd] focus:bg-white focus:border-[#a70009] outline-none transition-all placeholder:text-[#5c403c]/40 font-medium"
        />
      </div>

      {/* album select */}
      <div className="space-y-1.5">
        <label className="block font-jakarta font-bold text-[10px] text-[#181c1f] uppercase tracking-wide">
          Pilih Album Kegiatan
        </label>
        <select
          value={selectedAlbumId}
          onChange={(e) => setSelectedAlbumId(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-[#e5bdb8] text-sm bg-[#f7fafd] focus:bg-white focus:border-[#a70009] outline-none transition-all font-semibold text-[#181c1f]"
        >
          {albums.map((album) => (
            <option key={album.id} value={album.id}>
              {album.title}
            </option>
          ))}
        </select>
      </div>

      {/* File Dropzone */}
      <div className="space-y-1.5">
        <label className="block font-jakarta font-bold text-[10px] text-[#181c1f] uppercase tracking-wide">
          Foto Yang Ingin Diunggah
        </label>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {!previewUrl ? (
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={triggerFileInput}
            className="border-2 border-dashed border-[#e5bdb8] hover:border-[#a70009] bg-[#f7fafd] rounded-2xl p-8 text-center cursor-pointer transition-colors duration-200 flex flex-col items-center justify-center gap-3 select-none group"
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#5c403c]/60 group-hover:text-[#a70009] transition-colors border border-[#ebeef2] shadow-sm">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#181c1f]">
                Tarik & letakkan foto di sini, atau <span className="text-[#a70009] hover:underline">pilih file</span>
              </p>
              <p className="text-[10px] text-[#5c403c] mt-1">
                Format gambar (JPEG, PNG, WEBP), maksimal 5MB.
              </p>
            </div>
          </div>
        ) : (
          <div className="relative rounded-2xl border border-[#e5bdb8] overflow-hidden bg-zinc-50 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-auto max-h-80 object-contain mx-auto"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={triggerFileInput}
                className="px-4 py-2 bg-white text-xs font-bold text-[#181c1f] rounded-lg hover:bg-zinc-100 transition-colors shadow-sm cursor-pointer"
              >
                Ganti Foto
              </button>
              <button
                type="button"
                onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                className="px-4 py-2 bg-rose-600 text-xs font-bold text-white rounded-lg hover:bg-rose-700 transition-colors shadow-sm cursor-pointer"
              >
                Hapus
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Info Warning */}
      <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-[10px] text-amber-800 leading-relaxed space-y-1">
        <p className="font-extrabold uppercase">⚠️ Informasi & Ketentuan:</p>
        <p>• Foto yang Anda unggah tidak akan langsung muncul di galeri publik.</p>
        <p>• Foto Anda akan dikonversi secara otomatis ke format WebP terkompresi untuk menjaga performa loading website.</p>
        <p>• Panitia berhak menyetujui, mengedit caption, atau menolak foto yang dirasa kurang pantas.</p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isUploading || !selectedFile}
        className="w-full bg-[#a70009] text-white py-3.5 rounded-xl font-jakarta font-bold text-xs hover:bg-[#930006] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
      >
        {isUploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Mengonversi & Mengunggah Foto...
          </>
        ) : (
          "Kirim Foto Ke Panitia"
        )}
      </button>
    </form>
  );
}
