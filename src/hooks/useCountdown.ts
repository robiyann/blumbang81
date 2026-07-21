// src/hooks/useCountdown.ts
"use client";

import { useState, useEffect, useCallback } from "react";

interface CountdownValues {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

/**
 * Countdown hook that calculates remaining time to a target date.
 * Handles hydration safely by initializing on client only.
 */
export function useCountdown(targetDate: string): CountdownValues {
  const getTimeLeft = useCallback((): CountdownValues => {
    const target = new Date(targetDate).getTime();
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
      isExpired: false,
    };
  }, [targetDate]);

  // Initialize to zero to avoid hydration mismatch
  const [timeLeft, setTimeLeft] = useState<CountdownValues>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(getTimeLeft());

    const interval = setInterval(() => {
      const next = getTimeLeft();
      setTimeLeft(next);
      if (next.isExpired) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [getTimeLeft]);

  if (!mounted) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false };
  }

  return timeLeft;
}
