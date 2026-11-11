"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// ===========================================================================
// SVG thumbnail mapping — file ada di public/mood/
// ===========================================================================
export const MOOD_SVG: Record<string, string> = {
  "clean-modern": "/mood/modern-bersih.svg",
  "warm-earthy":  "/mood/hangat-alami.svg",
  "bold-vibrant": "/mood/ceria-berwarna.svg",
  "dark-premium": "/mood/elegan-mewah.svg",
  "bold-dark":    "/mood/tegas-berenergi.svg",
  "retro":        "/mood/klasik-retro.svg",
  "futuristic":   "/mood/futuristik.svg",
};

// ===========================================================================
// MoodCard — chip besar (dipakai di wizard mood-chips widget)
// ===========================================================================
interface MoodCardProps {
  value: string;
  label: string;
  isSelected: boolean;
  isLocked: boolean;
  onClick: () => void;
  /** Mode read-only: tampilan card yang sama tapi tidak bisa diklik */
  readOnly?: boolean;
}

export function MoodCard({ value, label, isSelected, isLocked, onClick, readOnly = false }: MoodCardProps) {
  const svgSrc = MOOD_SVG[value];

  const inner = (
    <>
      {/* Thumbnail SVG — hampir penuh tinggi card */}
      <div className="relative shrink-0">
        <div
          className={cn(
            "w-14 h-14 rounded-lg overflow-hidden transition-transform duration-200",
            !readOnly && (isSelected ? "scale-[1.02]" : "group-hover:scale-[1.02]")
          )}
        >
          {svgSrc ? (
            <Image
              src={svgSrc}
              alt={label}
              width={56}
              height={56}
              className="w-full h-full object-cover"
              priority={false}
            />
          ) : (
            <div className="w-full h-full bg-white/10 rounded-lg" />
          )}
        </div>

        {/* Badge centang di pojok kanan atas thumbnail — hanya di interactive selected */}
        {!readOnly && isSelected && (
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center shadow-md ring-2 ring-[#16191E]">
            <svg
              width="7"
              height="7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0f172a"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}
      </div>

      {/* Label */}
      <span className="text-[13px] sm:text-sm font-semibold text-white leading-snug flex-1 min-w-0 pr-2">
        {label}
      </span>
    </>
  );

  // Read-only: pakai div biasa, style sama dengan bubble user (putih)
  if (readOnly) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-3 rounded-xl border p-1.5",
          "border-white/20 bg-white/10"
        )}
      >
        {inner}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLocked}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl border text-left transition-all duration-200 focus:outline-none overflow-hidden",
        "p-1.5",
        isSelected
          ? "border-primary bg-primary/10 ring-2 ring-primary/30 shadow-md shadow-primary/15"
          : isLocked
          ? "border-border/50 bg-muted/30 opacity-45 cursor-not-allowed"
          : "border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 cursor-pointer active:scale-[0.98]"
      )}
      style={isSelected ? {} : { backdropFilter: "blur(4px)" }}
    >
      {inner}
    </button>
  );
}

// ===========================================================================
// MoodPill — chip kecil horizontal (dipakai di ThemePanel MoodSection)
// ===========================================================================
interface MoodPillProps {
  value: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export function MoodPill({ value, label, isActive, onClick }: MoodPillProps) {
  const svgSrc = MOOD_SVG[value];

  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-left transition-all cursor-pointer select-none shrink-0",
        isActive
          ? "border-primary bg-primary/10 ring-1 ring-primary/40"
          : "border-border/70 bg-sidebar hover:border-border hover:bg-sidebar-muted/60"
      )}
    >
      {/* Thumbnail kecil */}
      <div
        className={cn(
          "w-5 h-5 rounded-md overflow-hidden shrink-0 transition-transform duration-200",
          isActive ? "scale-105" : "group-hover:scale-105"
        )}
      >
        {svgSrc ? (
          <Image
            src={svgSrc}
            alt={label}
            width={20}
            height={20}
            className="w-full h-full object-cover"
            priority={false}
          />
        ) : (
          <div className="w-full h-full bg-white/10 rounded-md" />
        )}
      </div>

      <span
        className={cn(
          "text-[11px] leading-tight whitespace-nowrap",
          isActive
            ? "font-bold text-sidebar-foreground"
            : "font-medium text-sidebar-foreground/90"
        )}
      >
        {label}
      </span>

      {/* Dot aktif */}
      {isActive && (
        <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-primary text-primary-foreground shrink-0">
          <svg
            width="6"
            height="6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      )}
    </button>
  );
}

// ===========================================================================
// MoodBubbleIcon — thumbnail mungil di bubble chat user (setelah pilih mood)
// ===========================================================================
interface MoodBubbleIconProps {
  value: string;
  label: string;
}

export function MoodBubbleIcon({ value, label }: MoodBubbleIconProps) {
  const svgSrc = MOOD_SVG[value];
  if (!svgSrc) return null;

  return (
    <span className="inline-block w-5 h-5 rounded-md overflow-hidden shrink-0 align-middle">
      <Image
        src={svgSrc}
        alt={label}
        width={20}
        height={20}
        className="w-full h-full object-cover"
        priority={false}
      />
    </span>
  );
}
