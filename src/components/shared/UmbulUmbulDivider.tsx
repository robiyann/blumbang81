// src/components/shared/UmbulUmbulDivider.tsx
import { cn } from "@/utils/cn";

interface UmbulUmbulDividerProps {
  color?: "red" | "white";
  className?: string;
  flipped?: boolean;
}

/**
 * Traditional Indonesian pennant (umbul-umbul) decorative divider.
 * Used between sections to add a festive, patriotic accent.
 */
export function UmbulUmbulDivider({
  color = "red",
  className,
  flipped = false,
}: UmbulUmbulDividerProps) {
  const fillColor = color === "red" ? "%23ce201c" : "%23ffffff";
  const bgImage = `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 20' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='0,0 10,20 20,0 30,20 40,0 50,20 60,0 70,20 80,0 90,20 100,0' fill='${fillColor}'/%3E%3C/svg%3E")`;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "h-5 w-full",
        flipped ? "rotate-180" : "",
        className
      )}
      style={{
        backgroundImage: bgImage,
        backgroundSize: "100% 100%",
      }}
    />
  );
}
