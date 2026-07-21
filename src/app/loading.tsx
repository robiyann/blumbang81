// src/app/loading.tsx
"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] bg-white/70 backdrop-blur-md flex flex-col items-center justify-center gap-4 select-none">
      {/* Outer spinning ring */}
      <div className="relative w-16 h-16">
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-[#ebeef2]"
          aria-hidden="true"
        />
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#a70009] border-r-[#a70009]"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
        />
      </div>

      {/* Pulsing text */}
      <motion.p
        className="font-jakarta font-extrabold text-xs text-[#a70009] tracking-widest uppercase mt-2"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      >
        Memuat Halaman...
      </motion.p>
    </div>
  );
}
