// src/components/home/HeroSection.tsx
import Link from "next/link";
import { UmbulUmbulDivider } from "@/components/shared/UmbulUmbulDivider";
import { Heart, Flag } from "lucide-react";

export function HeroSection() {
  return (
    <section
      className="relative min-h-[90vh] flex flex-col justify-center items-center text-center overflow-hidden"
      aria-label="Hero — HUT Kemerdekaan RI ke-81"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/bg.jpg')`,
          backgroundPosition: "center 30%",
        }}
        aria-hidden="true"
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/75"
        aria-hidden="true"
      />

      {/* Decorative flag icons */}
      <div
        className="absolute top-1/4 left-6 md:left-16 opacity-15 -rotate-12 pointer-events-none"
        aria-hidden="true"
      >
        <Flag className="w-24 h-24 text-white" />
      </div>
      <div
        className="absolute bottom-1/4 right-6 md:right-16 opacity-15 rotate-12 pointer-events-none"
        aria-hidden="true"
      >
        <Heart className="w-24 h-24 text-white" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-5 md:px-10">

        {/* Headline */}
        <h1 className="font-jakarta font-extrabold text-white leading-tight mb-6"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
          Peringatan HUT Kemerdekaan RI ke-81
        </h1>

        {/* Red accent bar */}
        <div className="w-24 h-1 bg-[#a70009] mx-auto mb-6 rounded-full" aria-hidden="true" />

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed">
          Blumbang RT 15, Desa Saren, Kec. Kalijambe, Kab. Sragen
        </p>

        {/* Meta date */}
        <p className="font-jetbrains text-sm text-[#ffb4aa] uppercase tracking-widest mb-10">
          17 Agustus 2026
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/keuangan"
            className="inline-flex items-center justify-center gap-2 bg-[#a70009] text-white font-semibold text-base px-8 py-4 rounded-full hover:bg-[#930006] active:scale-95 transition-all duration-200 shadow-lg"
          >
            <Heart className="w-5 h-5" aria-hidden="true" />
            Dukung Acara
          </Link>
          <Link
            href="/jadwal"
            className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white font-semibold text-base px-8 py-4 rounded-full border border-white/30 hover:bg-white/20 active:scale-95 transition-all duration-200"
          >
            Lihat Jadwal
          </Link>
        </div>
      </div>

      {/* Bottom umbul-umbul */}
      <div className="absolute bottom-0 left-0 right-0 z-10" aria-hidden="true">
        <UmbulUmbulDivider color="red" />
      </div>
    </section>
  );
}
