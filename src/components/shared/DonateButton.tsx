"use client";

// src/components/shared/DonateButton.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { cn } from "@/utils/cn";

interface DonateButtonProps {
  className?: string;
  compact?: boolean;
}

export function DonateButton({ className, compact = false }: DonateButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    router.push("/keuangan#rekening-pembayaran");
    // Fallback reset if page hasn't navigated within 3s
    setTimeout(() => setIsLoading(false), 3000);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 overflow-hidden",
        "bg-[#a70009] text-white font-semibold rounded transition-all duration-200",
        "hover:bg-[#930006] active:scale-95 shadow-sm",
        "disabled:cursor-not-allowed",
        compact ? "text-sm px-5 py-2.5" : "text-sm px-5 py-3",
        className
      )}
    >
      {/* Shimmer sweep animation when loading */}
      {isLoading && (
        <span
          className="absolute inset-0 animate-shimmer-sweep"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)",
            backgroundSize: "200% 100%",
          }}
        />
      )}

      {/* Content */}
      <span className="relative flex items-center gap-2">
        {isLoading ? (
          <>
            {/* Spinner */}
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Menuju Halaman...</span>
          </>
        ) : (
          <>
            <Heart className="w-4 h-4 fill-white text-white" />
            <span>Donasi Sekarang</span>
          </>
        )}
      </span>
    </button>
  );
}
