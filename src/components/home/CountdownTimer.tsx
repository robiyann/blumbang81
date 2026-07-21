"use client";

// src/components/home/CountdownTimer.tsx
import { useCountdown } from "@/hooks/useCountdown";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const EVENT_DATE = "2026-08-17T00:00:00+07:00";

interface TimeUnitProps {
  value: number;
  label: string;
  reducedMotion: boolean;
}

function TimeUnit({ value, label, reducedMotion }: TimeUnitProps) {
  const display = String(value).padStart(2, "0");

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        key={value}
        initial={reducedMotion ? {} : { rotateX: -90, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative"
        style={{ perspective: "400px" }}
      >
        <div
          className={cn(
            "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24",
            "bg-[#a70009] text-white rounded-lg",
            "flex items-center justify-center",
            "font-jakarta font-extrabold",
            "text-2xl sm:text-3xl md:text-4xl",
            "shadow-lg relative overflow-hidden"
          )}
        >
          {/* Shine effect */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent"
            aria-hidden="true"
          />
          <span className="relative tabular-nums">{display}</span>
        </div>
      </motion.div>
      <span className="font-jetbrains text-xs text-[#5c403c] uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

function Separator() {
  return (
    <div className="flex flex-col gap-2 mt-2 self-start pt-7 sm:pt-9 md:pt-10">
      <div className="w-1.5 h-1.5 rounded-full bg-[#a70009]" aria-hidden="true" />
      <div className="w-1.5 h-1.5 rounded-full bg-[#a70009]" aria-hidden="true" />
    </div>
  );
}

/**
 * Client-side countdown timer targeting Independence Day 2026.
 * Uses digit flip animation via Framer Motion, respects reduced-motion.
 */
export default function CountdownTimer() {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(EVENT_DATE);
  const reducedMotion = useReducedMotion();

  if (isExpired) {
    return (
      <div className="text-center py-8">
        <p className="font-jakarta font-extrabold text-3xl text-[#a70009]">
          🎉 MERDEKA! 🎉
        </p>
        <p className="text-[#5c403c] mt-2">Selamat HUT Kemerdekaan RI ke-81!</p>
      </div>
    );
  }

  return (
    <div
      className="flex items-start justify-center gap-3 sm:gap-4 md:gap-6"
      role="timer"
      aria-label={`Hitung mundur: ${days} hari, ${hours} jam, ${minutes} menit, ${seconds} detik`}
      aria-live="off"
    >
      <TimeUnit value={days} label="Hari" reducedMotion={reducedMotion} />
      <Separator />
      <TimeUnit value={hours} label="Jam" reducedMotion={reducedMotion} />
      <Separator />
      <TimeUnit value={minutes} label="Menit" reducedMotion={reducedMotion} />
      <Separator />
      <TimeUnit value={seconds} label="Detik" reducedMotion={reducedMotion} />
    </div>
  );
}
