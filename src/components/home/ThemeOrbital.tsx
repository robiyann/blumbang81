// src/components/home/ThemeOrbital.tsx
"use client";

import { motion } from "framer-motion";
import { Baby, Users, UsersRound, PersonStanding } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";

const groups = [
  {
    icon: Baby,
    label: "Balita & Anak-anak",
    sublabel: "Membangun keberanian",
    position: "top-left",
  },
  {
    icon: Users,
    label: "Pemuda & Pemudi",
    sublabel: "Katalisator energi",
    position: "top-right",
  },
  {
    icon: UsersRound,
    label: "Bapak-bapak & Ibu-ibu",
    sublabel: "Menjaga kekompakan",
    position: "bottom-left",
  },
  {
    icon: PersonStanding,
    label: "Sesepuh & Lansia",
    sublabel: "Menyaksikan kerukunan",
    position: "bottom-right",
  },
];

const card = {
  hidden: { opacity: 0, scale: 0.9 },
  show: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

export function ThemeOrbital() {
  return (
    <section className="py-24 px-5 md:px-20 bg-[#f1f4f8]">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          title="Ruang Gembira untuk Seluruh Lapisan Warga"
          subtitle="Sasaran utama kegiatan adalah seluruh warga masyarakat Blumbang RT 15 tanpa terkecuali."
          accentBar
          className="mb-16"
        />

        {/* Desktop: orbital layout. Mobile: 2x2 grid */}
        <div className="relative">
          {/* Mobile/Tablet Grid */}
          <div className="grid grid-cols-2 gap-4 lg:hidden">
            {/* Center hub in grid */}
            <div className="col-span-2 flex justify-center mb-4">
              <div className="w-48 h-48 bg-white rounded-full border-8 border-[#a70009] flex flex-col items-center justify-center p-4 text-center shadow-xl">
                <p className="font-jetbrains text-[10px] text-[#5c403c] uppercase tracking-wider mb-1">
                  Tema Kegiatan:
                </p>
                <h3 className="font-jakarta font-bold text-sm text-[#a70009] leading-tight">
                  "Semangat Gotong-royong Lintas Generasi"
                </h3>
              </div>
            </div>

            {groups.map((group, i) => (
              <motion.div
                key={group.label}
                custom={i}
                variants={card}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-card border border-[#e5bdb8]"
              >
                <div className="w-12 h-12 bg-[#ebeef2] rounded-full flex items-center justify-center text-[#a70009] shrink-0">
                  <group.icon className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-jakarta font-bold text-sm text-[#181c1f]">
                    {group.label}
                  </p>
                  <p className="text-xs text-[#5c403c]">{group.sublabel}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Desktop Orbital Layout */}
          <div className="hidden lg:block relative min-h-[480px]">
            {/* Center Hub */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: "backOut" as const }}
                className="w-64 h-64 bg-white rounded-full border-8 border-[#a70009] flex flex-col items-center justify-center p-6 text-center shadow-2xl"
              >
                <p className="font-jetbrains text-[11px] text-[#5c403c] uppercase tracking-wider mb-2">
                  Tema Kegiatan:
                </p>
                <h3 className="font-jakarta font-bold text-base text-[#a70009] leading-tight">
                  "Semangat Gotong-royong Lintas Generasi"
                </h3>
              </motion.div>
            </div>

            {/* Connecting lines */}
            <svg
              className="absolute inset-0 w-full h-full"
              aria-hidden="true"
            >
              <line x1="50%" y1="50%" x2="20%" y2="25%" stroke="#e5bdb8" strokeWidth="2" strokeDasharray="6 4" />
              <line x1="50%" y1="50%" x2="80%" y2="25%" stroke="#e5bdb8" strokeWidth="2" strokeDasharray="6 4" />
              <line x1="50%" y1="50%" x2="20%" y2="75%" stroke="#e5bdb8" strokeWidth="2" strokeDasharray="6 4" />
              <line x1="50%" y1="50%" x2="80%" y2="75%" stroke="#e5bdb8" strokeWidth="2" strokeDasharray="6 4" />
            </svg>

            {/* Satellite cards */}
            {[
              { ...groups[0], top: "5%", left: "2%" },
              { ...groups[1], top: "5%", right: "2%", left: "auto" },
              { ...groups[2], bottom: "5%", left: "2%", top: "auto" },
              { ...groups[3], bottom: "5%", right: "2%", left: "auto", top: "auto" },
            ].map((group, i) => (
              <motion.div
                key={group.label}
                custom={i}
                variants={card}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="absolute flex items-center gap-3 bg-white p-4 rounded-xl shadow-card border border-[#e5bdb8] max-w-[220px]"
                style={{
                  top: group.top,
                  left: group.left,
                  bottom: (group as { bottom?: string }).bottom,
                  right: (group as { right?: string }).right,
                }}
              >
                <div className="w-14 h-14 bg-[#ebeef2] rounded-full flex items-center justify-center text-[#a70009] shrink-0">
                  <group.icon className="w-7 h-7" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-jakarta font-bold text-sm text-[#181c1f] leading-tight">
                    {group.label}
                  </p>
                  <p className="text-xs text-[#5c403c] mt-0.5">
                    {group.sublabel}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
