// src/components/home/ThreePillars.tsx
"use client";

import { motion } from "framer-motion";
import { Heart, Handshake, Flame } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";

const pillars = [
  {
    icon: Heart,
    title: "Mensyukuri Kemerdekaan",
    description:
      "Wujud rasa syukur kepada Tuhan YME atas nikmat kemerdekaan sejak 17 Agustus 1945.",
    color: "#a70009",
  },
  {
    icon: Handshake,
    title: "Mempererat Silaturahmi",
    description:
      "Mengukuhkan persatuan dan menghidupkan kembali semangat gotong royong antar warga Blumbang RT 15.",
    color: "#a70009",
  },
  {
    icon: Flame,
    title: "Menumbuhkan Sportivitas",
    description:
      "Membangun kreativitas, semangat kebangsaan, dan solidaritas untuk menghadapi tantangan global.",
    color: "#a70009",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const card = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export function ThreePillars() {
  return (
    <section className="py-24 px-5 md:px-20 bg-white">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Tiga Pilar"
          title="Tiga Pilar Utama Perayaan Kemerdekaan"
          accentBar
          className="mb-16"
        />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          {pillars.map((pillar) => (
            <motion.div
              key={pillar.title}
              variants={card}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="bg-white border border-[#e5bdb8] border-t-4 border-t-[#a70009] rounded-lg p-8 text-center shadow-card hover:shadow-card-hover transition-shadow duration-300 group"
            >
              <div className="w-20 h-20 mx-auto bg-[#ffdad5] rounded-full flex items-center justify-center mb-6">
                <pillar.icon
                  className="w-9 h-9 text-[#a70009]"
                  aria-hidden="true"
                />
              </div>
              <h3 className="font-jakarta font-bold text-xl text-[#181c1f] mb-4">
                {pillar.title}
              </h3>
              <p className="text-base text-[#5c403c] leading-relaxed">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
