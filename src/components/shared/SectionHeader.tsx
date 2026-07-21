// src/components/shared/SectionHeader.tsx
import { cn } from "@/utils/cn";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  titleClassName?: string;
  accentBar?: boolean;
}

/**
 * Reusable section header component.
 * Supports eyebrow label, title, subtitle, and optional red accent bar.
 */
export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  centered = true,
  className,
  titleClassName,
  accentBar = false,
}: SectionHeaderProps) {
  return (
    <div className={cn(centered ? "text-center" : "", className)}>
      {eyebrow && (
        <p className="font-jetbrains text-xs text-[#a70009] uppercase tracking-[0.1em] mb-3">
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-jakarta font-bold text-[#181c1f] leading-tight",
          "text-2xl md:text-3xl lg:text-[2rem]",
          titleClassName
        )}
      >
        {title}
      </h2>
      {accentBar && (
        <div
          className={cn(
            "mt-4 h-1 w-16 bg-[#a70009] rounded-full",
            centered ? "mx-auto" : ""
          )}
          aria-hidden="true"
        />
      )}
      {subtitle && (
        <p
          className={cn(
            "mt-4 text-base md:text-lg text-[#5c403c] leading-relaxed",
            centered ? "max-w-2xl mx-auto" : ""
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
