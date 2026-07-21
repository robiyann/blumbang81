"use client";

// src/components/gallery/ImageModal.tsx
import { useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import type { GalleryImage } from "@/types/gallery";

interface ImageModalProps {
  images: GalleryImage[];
  currentIndex: number | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function ImageModal({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: ImageModalProps) {
  const isOpen = currentIndex !== null;
  const current = isOpen && currentIndex !== null ? images[currentIndex] : null;

  // Keyboard navigation
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    },
    [isOpen, onClose, onNext, onPrev]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && current && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`Foto: ${current.altText}`}
        >
          {/* Image container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative max-w-5xl max-h-[85vh] w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={current.url}
              alt={current.altText || "Gallery photo"}
              width={current.width || 1200}
              height={current.height || 800}
              className="max-h-[80vh] w-auto object-contain rounded-lg shadow-2xl"
              priority
            />

            {/* Caption */}
            {current.altText && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 rounded-b-lg">
                <p className="text-white text-sm text-center">{current.altText}</p>
              </div>
            )}
          </motion.div>

          {/* Controls */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
            aria-label="Tutup foto"
          >
            <X className="w-6 h-6" />
          </button>

          {currentIndex !== null && currentIndex > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); onPrev(); }}
              className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
              aria-label="Foto sebelumnya"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {currentIndex !== null && currentIndex < images.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
              aria-label="Foto berikutnya"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Counter */}
          {currentIndex !== null && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/40 text-white text-sm px-4 py-1.5 rounded-full">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
