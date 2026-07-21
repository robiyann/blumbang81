"use client";

// src/components/finance/CopyButton.tsx
import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  textToCopy: string;
}

export function CopyButton({ textToCopy }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(textToCopy.replace(/\s/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 border border-[#a70009] text-[#a70009] font-semibold text-sm px-6 py-3 rounded-xl hover:bg-[#ffdad5]/50 active:scale-95 transition-all duration-200 cursor-pointer shadow-xs"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-emerald-600 animate-in zoom-in-50 duration-150" />
          <span className="text-emerald-700 font-bold">Nomor Rekening Tersalin!</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          <span>Salin Rekening</span>
        </>
      )}
    </button>
  );
}
