"use client";

// src/app/admin/login/page.tsx
import { useState, useTransition } from "react";
import { loginAction } from "@/app/actions/admin";
import { useRouter } from "next/navigation";
import { Lock, User, AlertCircle, Flag } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await loginAction(null, formData);
      if (res.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(res.error || "Gagal masuk");
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#f7fafd] flex flex-col items-center justify-center p-5 relative overflow-hidden">
      {/* Decorative background vectors */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[#ffdad5] rounded-full filter blur-3xl opacity-40 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-[#ebeef2] rounded-full filter blur-3xl opacity-50 pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#e5bdb8] border-t-8 border-t-[#a70009] shadow-card p-8 relative z-10">
        {/* Brand */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative w-16 h-16 mb-4 flex items-center justify-center bg-[#f7fafd] rounded-2xl border border-[#ebeef2]">
            <Image
              src="/logos.webp"
              alt="Logo HUT RI 81"
              fill
              sizes="64px"
              className="object-contain p-2"
              priority
            />
          </div>
          <h1 className="font-jakarta font-extrabold text-2xl text-[#181c1f]">
            Masuk Admin Panel
          </h1>
          <p className="text-xs text-[#5c403c] mt-1">
            Kelola Pengumuman HUT RI ke-81 Blumbang RT 15
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-[#ffdad5] border-l-4 border-l-[#a70009] rounded-lg text-sm text-[#a70009] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block font-jakarta font-bold text-xs text-[#181c1f] mb-2 uppercase tracking-wide"
            >
              Username
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5c403c] opacity-60">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                id="username"
                name="username"
                required
                disabled={isPending}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#e5bdb8] focus:border-[#a70009] focus:ring-1 focus:ring-[#a70009] outline-none text-sm text-[#181c1f] transition-all bg-[#f7fafd] focus:bg-white"
                placeholder="Masukkan username"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block font-jakarta font-bold text-xs text-[#181c1f] mb-2 uppercase tracking-wide"
            >
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5c403c] opacity-60">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                id="password"
                name="password"
                required
                disabled={isPending}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#e5bdb8] focus:border-[#a70009] focus:ring-1 focus:ring-[#a70009] outline-none text-sm text-[#181c1f] transition-all bg-[#f7fafd] focus:bg-white"
                placeholder="Masukkan password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#a70009] text-white py-3 rounded-lg font-jakarta font-bold text-sm hover:bg-[#930006] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-8 shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isPending ? "Memverifikasi..." : "Masuk"}
          </button>
        </form>
      </div>

      {/* Back to Home Link */}
      <a
        href="/"
        className="mt-6 text-xs font-semibold text-[#5c403c] hover:text-[#a70009] transition-colors"
      >
        ← Kembali ke Website Utama
      </a>
    </div>
  );
}
