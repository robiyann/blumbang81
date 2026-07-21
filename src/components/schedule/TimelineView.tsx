"use client";

// src/components/schedule/TimelineView.tsx
import { motion } from "framer-motion";
import { MapPin, Calendar, Clock } from "lucide-react";
import type { ScheduleItem } from "@/types/schedule";
import { formatDate, formatTime } from "@/utils/formatDate";
import { cn } from "@/utils/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const typeConfig = {
  anak: { label: "Lomba Anak", color: "bg-blue-600", borderColor: "border-blue-600" },
  dewasa: { label: "Lomba Dewasa", color: "bg-zinc-700", borderColor: "border-zinc-700" },
  puncak: { label: "Puncak Acara", color: "bg-[#a70009]", borderColor: "border-[#a70009]" },
  persiapan: { label: "Persiapan", color: "bg-amber-600", borderColor: "border-amber-600" },
};

interface TimelineViewProps {
  items: ScheduleItem[];
}

export function TimelineView({ items }: TimelineViewProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="w-full relative py-8">
      {/* ─── DESKTOP HORIZONTAL VIEW ─── */}
      <div className="hidden md:block relative w-full">
        {/* Horizontal Line behind nodes */}
        <div
          className="absolute left-0 right-0 h-1 bg-[#ebeef2] top-[108px] z-0"
          aria-hidden="true"
        />

        <div className="grid grid-cols-3 gap-8 relative z-10">
          {items.slice(0, 3).map((item, index) => {
            const config = typeConfig[item.type] ?? typeConfig.persiapan;
            const isPeak = item.type === "puncak";

            return (
              <motion.div
                key={item.id}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="flex flex-col items-center group"
              >
                {/* 1. Header Area (Date/Time above the line) */}
                <div className="text-center h-20 flex flex-col justify-end mb-6">
                  <h3 className="font-jakarta font-extrabold text-[#a70009] text-lg lg:text-xl">
                    {formatDate(item.date, "d-MMMM yyyy").replace("-", "–")}
                  </h3>
                  <p className="font-jetbrains text-xs text-[#5c403c] font-semibold mt-1">
                    (Pkl {item.timeStart.replace(":", ".")})
                  </p>
                </div>

                {/* 2. Timeline Node */}
                <div className="relative my-2">
                  <motion.div
                    whileHover={prefersReducedMotion ? {} : { scale: 1.2 }}
                    className={cn(
                      "w-10 h-10 rounded-full border-4 border-white bg-[#505252] shadow-md flex items-center justify-center z-10 relative cursor-pointer transition-colors duration-300",
                      isPeak ? "bg-[#a70009] w-12 h-12 -my-1 shadow-primary-glow border-[#ffdad5]" : ""
                    )}
                  >
                    {isPeak && (
                      <div className="absolute inset-0 bg-[#a70009] rounded-full animate-ping opacity-25" />
                    )}
                  </motion.div>
                </div>

                {/* 3. Card Preview (Below the line) */}
                <div className="mt-6 w-full px-2">
                  <div
                    className={cn(
                      "bg-white rounded-2xl p-6 border border-[#e5bdb8] border-t-4 border-t-[#a70009] shadow-card hover:shadow-card-hover transition-all duration-300 relative text-center",
                      isPeak ? "border-2 border-[#a70009] shadow-primary-glow" : ""
                    )}
                  >
                    {/* Badge */}
                    <span
                      className={cn(
                        "inline-block font-jetbrains text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded text-white font-bold mb-3",
                        config.color
                      )}
                    >
                      {config.label}
                    </span>

                    <h4 className="font-jakarta font-extrabold text-base text-[#181c1f] leading-snug mb-2 line-clamp-2">
                      {item.title}
                    </h4>

                    {item.description && (
                      <p className="text-xs text-[#5c403c] leading-relaxed line-clamp-3 mb-4">
                        {item.description}
                      </p>
                    )}

                    <div className="flex items-center justify-center gap-1 text-xs text-[#5c403c] pt-2 border-t border-[#ebeef2]">
                      <MapPin className="w-3.5 h-3.5 text-[#a70009]" />
                      <span className="truncate max-w-[200px]">{item.location}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ─── MOBILE VERTICAL VIEW ─── */}
      <div className="md:hidden relative w-full pl-8 space-y-8">
        {/* Vertical line */}
        <div
          className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-[#ebeef2]"
          aria-hidden="true"
        />

        {items.map((item, index) => {
          const config = typeConfig[item.type] ?? typeConfig.persiapan;
          const isPeak = item.type === "puncak";

          return (
            <div key={item.id} className="relative flex items-start gap-4">
              {/* Circular node */}
              <div
                className={cn(
                  "absolute left-[-25px] w-8 h-8 rounded-full border-4 border-white bg-[#505252] shadow-sm flex items-center justify-center z-10",
                  isPeak ? "bg-[#a70009] shadow-primary-glow border-[#ffdad5]" : ""
                )}
                aria-hidden="true"
              >
                {isPeak && (
                  <div className="absolute inset-0 bg-[#a70009] rounded-full animate-ping opacity-25" />
                )}
              </div>

              {/* Card */}
              <div className="bg-white rounded-xl p-5 border border-[#e5bdb8] border-t-4 border-t-[#a70009] shadow-sm w-full">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span
                    className={cn(
                      "font-jetbrains text-[8px] uppercase tracking-widest px-2 py-0.5 rounded text-white font-bold",
                      config.color
                    )}
                  >
                    {config.label}
                  </span>
                  <span className="text-[11px] text-[#5c403c] font-semibold">
                    {formatDate(item.date)} · {formatTime(item.timeStart)}
                  </span>
                </div>

                <h3 className="font-jakarta font-bold text-base text-[#181c1f] mb-1">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-xs text-[#5c403c] leading-relaxed mb-3">
                    {item.description}
                  </p>
                )}
                <div className="flex items-center gap-1 text-[11px] text-[#5c403c] pt-2 border-t border-[#ebeef2]">
                  <MapPin className="w-3.5 h-3.5 text-[#a70009]" />
                  <span>{item.location}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
