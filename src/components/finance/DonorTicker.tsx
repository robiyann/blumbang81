// src/components/finance/DonorTicker.tsx
"use client";

import { useEffect, useState } from "react";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { formatRupiah } from "@/utils/formatCurrency";
import { motion, AnimatePresence } from "framer-motion";

interface Donor {
  id: string;
  donorName: string;
  amount: number;
  donatedAt: string;
}

interface DonorTickerProps {
  donors: Donor[];
  totalCollected: number;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 160 : -160,
    opacity: 0,
    scale: 0.98,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 160 : -160,
    opacity: 0,
    scale: 0.98,
  }),
};

export function DonorTicker({ donors, totalCollected }: DonorTickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<number>(1); // 1 = next, -1 = prev

  // Auto-cycle slideshow continuously
  useEffect(() => {
    if (donors.length <= 1) return;
    
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % donors.length);
    }, 4500); // 4.5 seconds for comfortable reading

    return () => clearInterval(interval);
  }, [donors.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + donors.length) % donors.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % donors.length);
  };

  const goTo = (idx: number) => {
    if (idx === currentIndex) return;
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  };

  if (donors.length === 0) {
    return (
      <div className="text-center py-10 text-[#5c403c] border border-dashed border-[#ebeef2] rounded-xl">
        <Heart className="w-7 h-7 text-[#ebeef2] mx-auto mb-2" />
        <p className="text-xs font-semibold">Belum ada donasi masuk.</p>
      </div>
    );
  }

  const current = donors[currentIndex];

  return (
    <div className="flex flex-col gap-4">
      {/* ── Ticker Card Container ── */}
      <div className="relative w-full px-4">
        {/* Navigation - Prev Button */}
        {donors.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute -left-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border border-[#e5bdb8] text-[#a70009] flex items-center justify-center hover:bg-[#ffdad5] active:scale-95 transition-all duration-200 cursor-pointer shadow-md"
            aria-label="Donatur sebelumnya"
          >
            <ChevronLeft className="w-4.5 h-4.5" />
          </button>
        )}

        {/* Carousel slide container with fixed height to accommodate transitions */}
        <div className="relative w-full overflow-hidden h-[195px] sm:h-[180px] rounded-2xl border-2 border-[#e5bdb8] bg-gradient-to-br from-[#fff5f5] to-white shadow-sm">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 260, damping: 26 },
                opacity: { duration: 0.25 },
                scale: { duration: 0.25 },
              }}
              className="absolute inset-0 p-6 flex flex-col justify-between w-full h-full"
            >
              {/* Decorative pulse ring */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#ffdad5] rounded-full opacity-40 animate-pulse pointer-events-none" />
              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-[#ffdad5] rounded-full opacity-20 pointer-events-none" />

              {/* "Live" badge */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[9px] uppercase tracking-widest font-bold text-emerald-600">Live</span>
              </div>

              {/* Donor info */}
              <div className="flex items-start gap-4 relative z-10">
                {/* Avatar circle */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#a70009] to-[#ce201c] flex items-center justify-center shrink-0 shadow-md">
                  <span className="text-white font-extrabold text-lg leading-none">
                    {current.donorName.charAt(0).toUpperCase()}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-widest text-[#5c403c] font-bold mb-1 flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-[#a70009] text-[#a70009]" />
                    Donatur Warga
                  </p>
                  <h4 className="font-jakarta font-extrabold text-base sm:text-lg text-[#181c1f] leading-tight truncate">
                    {current.donorName}
                  </h4>
                  <p className="font-extrabold text-xl sm:text-2xl text-emerald-600 mt-1">
                    {formatRupiah(current.amount)}
                  </p>
                  <p className="text-[10px] text-[#5c403c] font-semibold mt-1">{current.donatedAt}</p>
                </div>
              </div>

              {/* Progress: which item out of total */}
              <div className="pt-3 border-t border-[#ebeef2] flex items-center justify-between text-[10px] text-[#5c403c] font-semibold">
                <span>{currentIndex + 1} / {donors.length} donatur</span>
                <span className="font-extrabold text-[#a70009]">Total: {formatRupiah(totalCollected)}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation - Next Button */}
        {donors.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute -right-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border border-[#e5bdb8] text-[#a70009] flex items-center justify-center hover:bg-[#ffdad5] active:scale-95 transition-all duration-200 cursor-pointer shadow-md"
            aria-label="Donatur berikutnya"
          >
            <ChevronRight className="w-4.5 h-4.5" />
          </button>
        )}
      </div>

      {/* ── Dot navigation ── */}
      <div className="flex flex-wrap justify-center gap-2">
        {donors.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            aria-label={`Lihat donatur ${idx + 1}`}
            className="transition-all duration-200 rounded-full cursor-pointer"
            style={{
              width: idx === currentIndex ? "24px" : "8px",
              height: "8px",
              backgroundColor: idx === currentIndex ? "#a70009" : "#e5bdb8",
            }}
          />
        ))}
      </div>

      {/* ── Compact list under ticker ── */}
      <div className="mt-2 space-y-1.5 max-h-48 overflow-y-auto pr-1">
        {donors.map((d, idx) => (
          <button
            key={d.id}
            onClick={() => goTo(idx)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
              idx === currentIndex
                ? "bg-[#ffdad5] border border-[#e5bdb8]"
                : "hover:bg-[#f7fafd] border border-transparent"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#a70009] text-white text-[9px] font-extrabold flex items-center justify-center shrink-0">
                {String(idx + 1)}
              </span>
              <span className={`font-bold truncate max-w-[130px] ${idx === currentIndex ? "text-[#a70009]" : "text-[#181c1f]"}`}>
                {d.donorName}
              </span>
            </div>
            <span className={`font-extrabold shrink-0 ${idx === currentIndex ? "text-emerald-600" : "text-[#5c403c]"}`}>
              {formatRupiah(d.amount)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
