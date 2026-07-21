// src/components/home/VisionStatement.tsx
import { UmbulUmbulDivider } from "@/components/shared/UmbulUmbulDivider";

export function VisionStatement() {
  return (
    <section
      className="relative bg-[#ce201c] text-white overflow-hidden"
      aria-label="Visi dan Misi"
    >
      <UmbulUmbulDivider color="white" flipped className="opacity-20" />

      <div className="max-w-5xl mx-auto px-5 md:px-20 py-20 grid md:grid-cols-2 gap-12 items-center">
        {/* Quote side */}
        <div className="relative">
          <div
            className="absolute -top-6 -left-6 text-[120px] text-white/10 font-serif leading-none select-none"
            aria-hidden="true"
          >
            "
          </div>
          <h2 className="font-jakarta font-bold text-3xl md:text-4xl leading-tight mb-6 relative z-10">
            Kemerdekaan adalah momentum.
          </h2>
          <p className="text-lg text-white/90 border-l-4 border-white/40 pl-5 leading-relaxed">
            Merayakan 81 tahun kemerdekaan Republik Indonesia bukan sekadar
            seremoni. Ini adalah wujud syukur dan penghormatan kepada pahlawan
            melalui aksi nyata: melestarikan kerukunan antar warga.
          </p>
        </div>

        {/* Card side */}
        <div className="bg-white text-[#181c1f] p-8 rounded-xl shadow-xl border-t-4 border-[#a70009]">
          <p className="font-jakarta font-bold text-lg leading-relaxed">
            Panitia HUT RI ke-81 Blumbang RT 15 siap menghadirkan rangkaian
            acara yang positif, membahagiakan, dan menyatukan seluruh elemen
            warga.
          </p>
          <div className="mt-6 pt-6 border-t border-[#e5e8ec]">
            <p className="font-jetbrains text-xs text-[#5c403c] uppercase tracking-widest">
              Tema Kegiatan 2026
            </p>
            <p className="font-jakarta font-bold text-[#a70009] text-lg mt-1">
              "Semangat Gotong Royong Lintas Generasi"
            </p>
          </div>
        </div>
      </div>

      <UmbulUmbulDivider color="white" className="opacity-20" />
    </section>
  );
}
