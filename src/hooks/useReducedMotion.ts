// src/hooks/useReducedMotion.ts
"use client";

import { useState, useEffect } from "react";

/**
 * Returns true if the user prefers reduced motion.
 * Respects the `prefers-reduced-motion: reduce` media query.
 */
export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return prefersReduced;
}
