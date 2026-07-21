// src/components/finance/RabBreakdown.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatRupiah, formatCompactRupiah } from "@/utils/formatCurrency";
import { cn } from "@/utils/cn";

interface BudgetAllocation {
  percentage: number;
  amount: number;
  label: string;
  description: string;
  colorClass: string;
  textColorClass: string;
}

interface RabBreakdownProps {
  budgetAllocations: BudgetAllocation[];
  targetBudget: number;
}

const colorMap: Record<string, { hex: string; gradient: string; border: string; bg: string; dot: string }> = {
  "bg-[#a70009]": {
    hex: "#a70009",
    gradient: "from-[#a70009] to-[#ce201c]",
    border: "border-[#a70009]/20",
    bg: "bg-[#a70009]/5",
    dot: "bg-[#a70009] shadow-[#a70009]/50",
  },
  "bg-[#181c1f]": {
    hex: "#181c1f",
    gradient: "from-[#181c1f] to-[#3a3f44]",
    border: "border-[#181c1f]/20",
    bg: "bg-[#181c1f]/5",
    dot: "bg-[#181c1f] shadow-[#181c1f]/50",
  },
  "bg-[#686a6a]": {
    hex: "#686a6a",
    gradient: "from-[#686a6a] to-[#8c8f94]",
    border: "border-[#686a6a]/20",
    bg: "bg-[#686a6a]/5",
    dot: "bg-[#686a6a] shadow-[#686a6a]/50",
  },
  "bg-[#d7dade]": {
    hex: "#8b909a",
    gradient: "from-[#8b909a] to-[#b5bac2]",
    border: "border-[#8b909a]/20",
    bg: "bg-[#8b909a]/5",
    dot: "bg-[#8b909a] shadow-[#8b909a]/50",
  },
};

function getColorConfig(colorClass: string, index: number) {
  const config = colorMap[colorClass];
  if (config) return config;
  const fallbacks = [
    { hex: "#a70009", gradient: "from-[#a70009] to-[#ce201c]", border: "border-[#a70009]/20", bg: "bg-[#a70009]/5", dot: "bg-[#a70009] shadow-[#a70009]/50" },
    { hex: "#181c1f", gradient: "from-[#181c1f] to-[#3a3f44]", border: "border-[#181c1f]/20", bg: "bg-[#181c1f]/5", dot: "bg-[#181c1f] shadow-[#181c1f]/50" },
    { hex: "#686a6a", gradient: "from-[#686a6a] to-[#8c8f94]", border: "border-[#686a6a]/20", bg: "bg-[#686a6a]/5", dot: "bg-[#686a6a] shadow-[#686a6a]/50" },
    { hex: "#8b909a", gradient: "from-[#8b909a] to-[#b5bac2]", border: "border-[#8b909a]/20", bg: "bg-[#8b909a]/5", dot: "bg-[#8b909a] shadow-[#8b909a]/50" },
  ];
  return fallbacks[index % fallbacks.length];
}

export function RabBreakdown({ budgetAllocations, targetBudget }: RabBreakdownProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // SVG parameters
  const radius = 75;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius; // ~471.24

  // Pre-calculate rotations and positions
  let accumulatedPercentage = 0;
  const slices = budgetAllocations.map((item, index) => {
    const colorConfig = getColorConfig(item.colorClass, index);
    const percentage = item.percentage;
    const strokeDashoffset = circumference - (circumference * percentage) / 100;
    const rotation = (accumulatedPercentage * 360) / 100 - 90;
    accumulatedPercentage += percentage;

    return {
      ...item,
      colorConfig,
      strokeDashoffset,
      rotation,
    };
  });

  const activeItem = activeIndex !== null ? slices[activeIndex] : null;

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
      {/* LEFT COLUMN: INTERACTIVE DONUT CHART */}
      <div className="w-full lg:w-5/12 flex flex-col items-center justify-center relative select-none">
        <div className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center">
          
          {/* Animated SVG Donut */}
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 200 200"
            className="w-full h-full transform -rotate-180 scale-x-[-1] drop-shadow-xl"
          >
            {/* Background base circle */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="transparent"
              stroke="#f3f4f6"
              strokeWidth={strokeWidth}
            />

            {slices.map((slice, index) => {
              const isHovered = activeIndex === index;
              const isAnyHovered = activeIndex !== null;
              
              return (
                <motion.circle
                  key={slice.label}
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="transparent"
                  stroke={slice.colorConfig.hex}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference, opacity: 1 }}
                  animate={{ 
                    strokeDashoffset: slice.strokeDashoffset,
                    opacity: isAnyHovered && !isHovered ? 0.45 : 1
                  }}
                  transition={{ 
                    strokeDashoffset: { duration: 1.2, ease: "easeOut", delay: index * 0.1 },
                    opacity: { duration: 0.2 },
                    strokeWidth: { duration: 0.2 }
                  }}
                  style={{
                    transform: `rotate(${slice.rotation}deg)`,
                    transformOrigin: "100px 100px",
                    cursor: "pointer",
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                />
              );
            })}
          </svg>

          {/* Centered text card */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-8">
            <div className="bg-white rounded-full w-[170px] h-[170px] md:w-[195px] md:h-[195px] flex flex-col items-center justify-center p-4 shadow-lg border border-[#ebeef2] text-center overflow-hidden">
              <AnimatePresence mode="wait">
                {activeItem ? (
                  <motion.div
                    key={`active-${activeItem.label}`}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="flex flex-col items-center justify-center"
                  >
                    <span 
                      className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-1"
                      style={{ 
                        backgroundColor: activeItem.colorConfig.hex + "15",
                        color: activeItem.colorConfig.hex
                      }}
                    >
                      {activeItem.percentage}% Anggaran
                    </span>
                    <h5 className="font-jakarta font-extrabold text-[11px] md:text-[12px] text-[#5c403c] line-clamp-1 max-w-[130px] md:max-w-[160px]">
                      {activeItem.label}
                    </h5>
                    <p 
                      className="font-jakarta font-black text-base md:text-lg mt-1 whitespace-nowrap"
                      style={{ color: activeItem.colorConfig.hex }}
                    >
                      {formatCompactRupiah(activeItem.amount)}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="default"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="flex flex-col items-center justify-center"
                  >
                    <span className="font-jetbrains text-[9px] uppercase tracking-wider text-[#8b909a] font-bold">
                      Total Anggaran RAB
                    </span>
                    <p className="font-jakarta font-black text-lg md:text-xl text-[#a70009] mt-2 whitespace-nowrap">
                      {formatCompactRupiah(targetBudget)}
                    </p>
                    <span className="text-[9px] text-[#5c403c] mt-1 italic font-semibold">
                      HUT RI Ke-81 Blumbang
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: LIST OF ALLOCATION CARDS */}
      <div className="w-full lg:w-7/12 space-y-4">
        {slices.map((slice, index) => {
          const isHovered = activeIndex === index;
          const isAnyHovered = activeIndex !== null;

          return (
            <motion.div
              key={slice.label}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              className={cn(
                "p-4 bg-white rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between gap-3 shadow-sm",
                isHovered 
                  ? "border-[#a70009]/40 shadow-md translate-x-1" 
                  : "border-[#ebeef2] hover:border-[#a70009]/20",
                isAnyHovered && !isHovered ? "opacity-60" : "opacity-100"
              )}
              style={{
                background: isHovered 
                  ? `linear-gradient(to right, #ffffff, ${slice.colorConfig.hex}05)`
                  : "#ffffff"
              }}
            >
              {/* Left Accent indicator line */}
              <div 
                className={cn("absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300", isHovered ? "w-2" : "w-1.5")} 
                style={{ backgroundColor: slice.colorConfig.hex }}
              />

              <div className="pl-2 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={cn("w-2.5 h-2.5 rounded-full shrink-0 shadow-sm", slice.colorConfig.dot)} style={{ backgroundColor: slice.colorConfig.hex }} />
                    <h4 className="font-jakarta font-extrabold text-sm md:text-base text-[#181c1f] break-words">
                      {slice.label}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                    <span className="font-jakarta font-black text-sm sm:text-base md:text-lg text-[#181c1f] whitespace-nowrap">
                      {formatRupiah(slice.amount)}
                    </span>
                    <span 
                      className="font-jetbrains text-xs font-black px-2 py-0.5 rounded-md"
                      style={{ 
                        backgroundColor: slice.colorConfig.hex + "10", 
                        color: slice.colorConfig.hex 
                      }}
                    >
                      {slice.percentage}%
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#5c403c] mt-2 leading-relaxed font-medium">
                  {slice.description}
                </p>

                {/* Modern visual progress bar */}
                <div className="mt-3 w-full h-1.5 bg-[#ebeef2] rounded-full overflow-hidden">
                  <motion.div
                    className={cn("h-full bg-gradient-to-r rounded-full", slice.colorConfig.gradient)}
                    initial={{ width: 0 }}
                    animate={{ width: `${slice.percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
